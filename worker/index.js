const SITEMAP_URLS = [
  'https://researchprofiles.ku.dk/sitemap/persons.xml',
  'https://researchprofiles.ku.dk/sitemap/persons.xml?n=1',
  'https://researchprofiles.ku.dk/sitemap/persons.xml?n=2',
  'https://researchprofiles.ku.dk/sitemap/persons.xml?n=3',
  'https://researchprofiles.ku.dk/sitemap/persons.xml?n=4',
  'https://researchprofiles.ku.dk/sitemap/persons.xml?n=5',
];

const SLUG_CACHE_URL = 'https://internal.cache/ku-pure-person-slugs-v1';
const SLUG_CACHE_TTL = 21600; // 6 hours

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/æ/g, 'ae')
    .replace(/ö/g, 'o')
    .replace(/ä/g, 'a')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugToDisplayName(slug) {
  const base = slug.replace(/-\d+$/, '');
  return base
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

async function getPersonSlugs() {
  const cache = caches.default;
  const cacheKey = new Request(SLUG_CACHE_URL);
  const cached = await cache.match(cacheKey);
  if (cached) {
    const slugs = await cached.json();
    if (Array.isArray(slugs) && slugs.length > 0) return slugs;
  }

  const responses = await Promise.all(
    SITEMAP_URLS.map((u) =>
      fetch(u, { headers: { 'User-Agent': 'Research-Translator-Proxy' } }).catch(() => null)
    )
  );
  const texts = await Promise.all(
    responses.map((r) => (r && r.ok ? r.text() : Promise.resolve('')))
  );
  const combined = texts.join('\n');

  const slugSet = new Set();
  const re = /\/en\/persons\/([^\/\s<>"]+)/g;
  let m;
  while ((m = re.exec(combined)) !== null) {
    const slug = m[1].replace(/\/$/, '');
    if (slug && !slug.includes('?') && !slug.includes('&')) {
      slugSet.add(slug);
    }
  }
  const slugs = Array.from(slugSet);

  if (slugs.length > 0) {
    const cacheResponse = new Response(JSON.stringify(slugs), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${SLUG_CACHE_TTL}`,
      },
    });
    await cache.put(cacheKey, cacheResponse);
  }
  return slugs;
}

function scoreSlugsAgainstTokens(tokens, slugs) {
  const targetSlug = tokens.join('-');
  const scored = [];
  for (const slug of slugs) {
    const slugNorm = normalize(slug.replace(/-/g, ' '));
    const slugBaseTokens = slugNorm.split(/\s+/).filter(Boolean);
    const slugBaseStr = slugBaseTokens.join('-');
    const slugHasDisambig = /-\d+$/.test(slug);

    let score = 0;
    if (slugBaseStr === targetSlug) {
      score = slugHasDisambig ? 950 : 1000;
    } else {
      const allMatch = tokens.every((t) => slugBaseTokens.includes(t));
      if (allMatch) {
        score = 600 - Math.abs(slugBaseTokens.length - tokens.length) * 30;
      } else {
        // Forward prefix only: query token must be prefix of a slug token.
        // Reverse direction would match "Nielsen" against slug "Niels" etc.
        const allPrefix = tokens.every((t) =>
          slugBaseTokens.some((st) => {
            if (t.length < 4 || st.length < 4) return t === st;
            return st.startsWith(t);
          })
        );
        if (allPrefix) {
          score = 300 - Math.abs(slugBaseTokens.length - tokens.length) * 20;
        }
      }
    }

    if (score > 0) scored.push({ slug, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function matchSlugs(query, slugs) {
  const qn = normalize(query);
  let qTokens = qn.split(/[\s-]+/).filter(Boolean);

  // Drop single-letter initial tokens ("P." in "Anders P. Jensen") when enough
  // substantive tokens remain. Keep them if stripping would leave <2 tokens,
  // so single-surname queries like "Jensen" still work.
  if (qTokens.length >= 3) {
    const stripped = qTokens.filter((t) => t.length >= 2);
    if (stripped.length >= 2) qTokens = stripped;
  }
  if (qTokens.length === 0) return [];

  let scored = scoreSlugsAgainstTokens(qTokens, slugs);

  // N-1 fallback: if the full query yields nothing and we have 3+ tokens,
  // retry with each token dropped in turn. Handles cases like
  // "Mikkel Bolt Rasmussen" where the KU Pure slug is just "mikkel-bolt".
  if (scored.length === 0 && qTokens.length >= 3) {
    const seen = new Set();
    const combined = [];
    for (let i = 0; i < qTokens.length; i++) {
      const reduced = qTokens.filter((_, idx) => idx !== i);
      const sub = scoreSlugsAgainstTokens(reduced, slugs);
      for (const r of sub) {
        if (seen.has(r.slug)) continue;
        seen.add(r.slug);
        combined.push({ slug: r.slug, score: r.score - 200 });
      }
    }
    combined.sort((a, b) => b.score - a.score);
    scored = combined;
  }

  return scored.slice(0, 7).map(({ slug }) => ({
    name: slugToDisplayName(slug),
    title: '',
    institute: '',
    pureUrl: `https://researchprofiles.ku.dk/en/persons/${slug}`,
  }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/') {
      return new Response('Research Translator Proxy is active.', { headers: corsHeaders });
    }

    if (url.pathname === '/search') {
      const name = url.searchParams.get('name');
      if (!name || name.trim().length < 2) {
        return new Response(
          JSON.stringify({ error: 'Missing or too short ?name= parameter (min 2 chars)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      try {
        const slugs = await getPersonSlugs();
        if (slugs.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Could not load KU person index', results: [] }),
            { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const results = matchSlugs(name, slugs);
        return new Response(JSON.stringify({ results }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: `Search failed: ${err.message}`, results: [] }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (url.pathname === '/fetch') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) {
        return new Response('Missing ?url= parameter', { status: 400, headers: corsHeaders });
      }
      try {
        const resp = await fetch(targetUrl, {
          headers: { 'User-Agent': 'Research-Translator-Proxy' },
        });
        const body = await resp.text();
        return new Response(body, {
          status: resp.status,
          headers: {
            ...corsHeaders,
            'Content-Type': resp.headers.get('Content-Type') || 'text/html',
          },
        });
      } catch (err) {
        return new Response(`Proxy error: ${err.message}`, { status: 502, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/anthropic') {
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return new Response('ANTHROPIC_API_KEY not configured', { status: 500, headers: corsHeaders });
      }
      try {
        const body = await request.json();
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(body),
        });
        const data = await resp.text();
        return new Response(data, {
          status: resp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(`Anthropic proxy error: ${err.message}`, { status: 502, headers: corsHeaders });
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
