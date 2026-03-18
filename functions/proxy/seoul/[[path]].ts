interface Env {
  SEOUL_API_KEY?: string
  VITE_SEOUL_API_KEY?: string
}

const SEOUL_ORIGIN = 'https://openapi.seoul.go.kr:8088'

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
  const response = await fetch(upstreamUrl.toString(), {
    headers: {
      Accept: request.headers.get('Accept') || 'application/json',
    },
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
