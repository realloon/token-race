import OpenAI from 'openai'
import type { RelayProvider, TestRequest, TestResult } from '@/types'

export async function testProvider(
  provider: RelayProvider,
  request: TestRequest,
  onUpdate?: (patch: Partial<TestResult>) => void,
): Promise<TestResult> {
  const start = performance.now()
  const result: TestResult = {
    provider,
    stream: request.stream,
    latency: 0,
    status: 'running',
    outputText: '',
  }

  function update(patch: Partial<TestResult>) {
    Object.assign(result, patch)
    onUpdate?.(patch)
  }

  try {
    const client = new OpenAI({
      baseURL: `${window.location.origin}/${provider.id}`,
      apiKey: 'worker-proxy',
      dangerouslyAllowBrowser: true,
    })
    const params = {
      model: request.model,
      reasoning: { effort: request.reasoning },
      instructions: request.instructions,
      input: request.stream ? request.streamInputs : request.completeInputs,
    }

    if (request.stream) {
      const stream = client.responses.stream({ ...params, stream: true })
      let outputText = ''

      for await (const event of stream) {
        if (event.type === 'response.output_text.delta' && event.delta) {
          const isFirstToken = result.timeToFirstToken === undefined
          const timeToFirstToken =
            result.timeToFirstToken ?? performance.now() - start
          outputText += event.delta
          result.timeToFirstToken = timeToFirstToken
          if (isFirstToken) onUpdate?.({ timeToFirstToken })
        }
      }

      const response = await stream.finalResponse()
      update({
        status: 'success',
        outputText: outputText || response.output_text || '',
        usage: response.usage ?? undefined,
        raw: response,
      })
    } else {
      const response = await client.responses.create({ ...params, stream: false })
      update({
        status: 'success',
        outputText: response.output_text ?? '',
        usage: response.usage ?? undefined,
        raw: response,
      })
    }
  } catch (e) {
    update({
      status: 'error',
      error: e instanceof Error ? e.message : String(e),
    })
  } finally {
    update({ latency: performance.now() - start })
  }
  return result
}
