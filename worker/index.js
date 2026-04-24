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

function matchSlugs(query, slugs) {
  const qn = normalize(query);
  const qTokens = qn.split(/[\s-]+/).filter(Boolean);
  if (qTokens.length === 0) return [];
  const targetSlug = qTokens.join('-');

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
      const allMatch = qTokens.every((t) => slugBaseTokens.includes(t));
      if (allMatch) {
        score = 600;
        score -= Math.abs(slugBaseTokens.length - qTokens.length) * 30;
      } else {
        const allPrefix = qTokens.every((t) =>
          slugBaseTokens.some((st) => {
            const minLen = Math.min(t.length, st.length);
            if (minLen < 4) return t === st;
            return st.startsWith(t) || t.startsWith(st);
          })
        );
        if (allPrefix) {
          score = 300;
          score -= Math.abs(slugBaseTokens.length - qTokens.length) * 20;
        }
      }
    }

    if (score > 0) scored.push({ slug, score });
  }

  scored.sort((a, b) => b.score - a.score);
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
