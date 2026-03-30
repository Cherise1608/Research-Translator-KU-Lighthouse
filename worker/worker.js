const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status)
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    const url = new URL(request.url)

    // Endpoint 1: Fetch HTML from a KU Pure profile URL
    if (url.pathname === '/fetch' && request.method === 'GET') {
      const targetUrl = url.searchParams.get('url')
      if (!targetUrl) {
        return errorResponse('Missing url parameter', 400)
      }

      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10000)
        const response = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; KU-Research-Translator/1.0)',
            'Accept': 'text/html,application/xhtml+xml',
          },
          redirect: 'follow',
        })
        clearTimeout(timeout)

        if (!response.ok) {
          return errorResponse(`Could not fetch URL: ${response.status}`, 502)
        }

        const html = await response.text()
        return new Response(html, {
          headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
        })
      } catch (err) {
        if (err.name === 'AbortError') {
          return errorResponse('Timeout: page did not respond within 10 seconds', 504)
        }
        return errorResponse(`Fetch error: ${err.message}`, 502)
      }
    }

    // Endpoint 2: Proxy requests to Anthropic API
    if (url.pathname === '/api/anthropic' && request.method === 'POST') {
      try {
        const body = await request.json()

        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(body),
        })

        if (!anthropicResponse.ok) {
          const errText = await anthropicResponse.text()
          return errorResponse(`Anthropic API error: ${anthropicResponse.status} - ${errText}`, 502)
        }

        const data = await anthropicResponse.json()
        return jsonResponse(data)
      } catch (err) {
        return errorResponse(`API proxy error: ${err.message}`, 500)
      }
    }

    return errorResponse('Not found', 404)
  },
}
