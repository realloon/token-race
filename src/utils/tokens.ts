import type OpenAI from 'openai'

export function cachedTokensOf(usage?: OpenAI.Responses.ResponseUsage) {
  return usage?.input_tokens_details?.cached_tokens
}

export function outputTokensPerSecond(
  usage?: OpenAI.Responses.ResponseUsage,
  latency?: number,
  timeToFirstToken?: number,
) {
  const outputTokens = usage?.output_tokens

  if (
    outputTokens === undefined ||
    latency === undefined ||
    latency <= 0 ||
    timeToFirstToken === undefined
  ) {
    return undefined
  }

  const generationLatency = latency - timeToFirstToken

  if (generationLatency <= 0) return undefined

  return (outputTokens * 1000) / generationLatency
}
