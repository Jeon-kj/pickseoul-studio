interface Env {
  TOUR_API_KEY?: string
  VITE_TOUR_API_KEY?: string
}

const TOUR_ORIGIN = 'https://apis.data.go.kr/B551011/KorService2'

function getTourApiKey(env: Env) {
  return env.TOUR_API_KEY?.trim() || env.VITE_TOUR_API_KEY?.trim()
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  const apiKey = getTourApiKey(env)

  if (!apiKey) {
    return new Response('Missing Tour API key', { status: 500 })
  }

  const rawPath = params.path
  const pathSegments = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : []
  const upstreamPath = pathSegments.join('/')

  if (!upstreamPath) {
    return new Response('Missing Tour API path', { status: 400 })
  }

  const incomingUrl = new URL(request.url)
  const upstreamUrl = new URL(`${TOUR_ORIGIN}/${upstreamPath}`)

  for (const [key, value] of incomingUrl.searchParams.entries()) {
    upstreamUrl.searchParams.set(key, value)
  }

  upstreamUrl.searchParams.set('serviceKey', apiKey)

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
