# Token Race

Compare response latency, first-token latency, output, and token usage across multiple OpenAI-compatible relay providers.

The Vue application and its API proxy deploy together as a single Cloudflare Worker. Provider API keys are read only by the Worker and are never included in browser assets.

## Local development

Install dependencies:

```sh
bun install
```

Create a local `.dev.vars` file with rotated API keys:

```dotenv
RELAYRAX_API_KEY=...
RIGHTAPI_API_KEY=...
CODEXFOR_API_KEY=...
```

Start Vite and the local Workers runtime:

```sh
bun dev
```

## Build and preview

```sh
bun run build
bun run preview
```

## Deploy

Authenticate Wrangler and configure production secrets:

```sh
bunx wrangler login
bunx wrangler secret put RELAYRAX_API_KEY
bunx wrangler secret put RIGHTAPI_API_KEY
bunx wrangler secret put CODEXFOR_API_KEY
```

Deploy the Worker and static assets:

```sh
bun run deploy
```

Protect the deployed application with Cloudflare Access. Without authentication, its proxy endpoints can be called by anyone who can reach the Worker.
