interface Env {
  SEOUL_API_KEY?: string
  VITE_SEOUL_API_KEY?: string
}

const SEOUL_ORIGIN = 'http://openapi.seoul.go.kr:8088'

function getSeoulApiKey(env: Env) {
  return env.SEOUL_API_KEY?.trim() || env.VITE_SEOUL_API_KEY?.trim()
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  const apiKey = getSeoulApiKey(env)

  if (!apiKey) {
    return new Response('Missing Seoul API key', { status: 500 })
  }

  const rawPath = params.path
  const pathSegments = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : []
  const upstreamPath = pathSegments.join('/')

  if (!upstreamPath) {
    return new Response('Missing Seoul API path', { status: 400 })
  }

  const upstreamUrl = new URL(`${SEOUL_ORIGIN}/${apiKey}/${upstreamPath}`)
  const requestHeaders = {
    Accept: request.headers.get('Accept') || 'application/json',
  }

  try {
    const response = await fetch(upstreamUrl.toString(), {
      headers: requestHeaders,
    })

    if (!response.ok) {
      const responseText = await response.text()

      console.error('Seoul API proxy upstream error', {
        url: upstreamUrl.toString(),
        status: response.status,
        statusText: response.statusText,
        body: responseText.slice(0, 1000),
      })

      return new Response(responseText, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upstream error'

    console.error('Seoul API proxy request failed', {
      url: upstreamUrl.toString(),
      message,
    })

    return new Response(
      JSON.stringify({
        error: 'Seoul API proxy request failed',
        message,
        url: upstreamUrl.toString(),
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}
