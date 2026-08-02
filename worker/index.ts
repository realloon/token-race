interface Env {
  RELAYRAX_API_KEY: string
  RIGHTAPI_API_KEY: string
  CODEXFOR_API_KEY: string
}

const providers = {
  relayrax: {
    baseUrl: 'https://relayrax.com/v1',
    secret: 'RELAYRAX_API_KEY',
  },
  rightapi: {
    baseUrl: 'https://www.rightapi.ai/codex/v1',
    secret: 'RIGHTAPI_API_KEY',
  },
  codexfor: {
    baseUrl: 'https://hello.vangularcode.asia/v1',
    secret: 'CODEXFOR_API_KEY',
  },
} as const

type ProviderId = keyof typeof providers

const routePattern = /^\/(relayrax|rightapi|codexfor)\/responses$/

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    const match = routePattern.exec(url.pathname)

    if (!match) {
      return new Response('Not found', { status: 404 })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'POST' },
      })
    }

    const provider = providers[match[1] as ProviderId]
    const apiKey = env[provider.secret]

    if (!apiKey) {
      throw new Error(`Missing Worker secret: ${provider.secret}`)
    }

    const upstreamUrl = new URL(`${provider.baseUrl}/responses`)
    upstreamUrl.search = url.search

    const headers = new Headers({
      authorization: `Bearer ${apiKey}`,
      'content-type': request.headers.get('content-type') ?? 'application/json',
    })
    const accept = request.headers.get('accept')
    if (accept) headers.set('accept', accept)

    return fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: request.body,
    })
  },
} satisfies ExportedHandler<Env>
