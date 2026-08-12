import { reactive, ref } from 'vue'
import { providers } from '@/utils/providers'
import { testProvider } from '@/utils/relay'
import type { TestRequest, TestResult } from '@/types'

export function useRelayTest() {
  const request = reactive<TestRequest>({
    model: 'gpt-5.6-luna',
    reasoning: 'none',
    stream: true,
    instructions: 'you are luna',
    completeInputs: [
      {
        role: 'developer',
        content: 'Just say pong',
      },
      { role: 'user', content: 'ping' },
    ],
    streamInputs: [
      {
        role: 'developer',
        content: 'Repeat the user message verbatim. Output nothing else.',
      },
      {
        role: 'user',
        content:
          'The quick brown fox jumps over the lazy dog. This fixed sentence gives the stream enough output tokens to compare first-token latency, transfer time, and total completion time across relay providers.',
      },
    ],
  })

  const selectedIds = ref<string[]>(providers.map(p => p.id))
  const running = ref(false)
  const results = ref<TestResult[]>([])

  function toggle(id: string) {
    selectedIds.value = selectedIds.value.includes(id)
      ? selectedIds.value.filter(x => x !== id)
      : [...selectedIds.value, id]
  }

  async function runAll() {
    if (running.value || !selectedIds.value.length) return
    running.value = true
    const targets = providers.filter(p => selectedIds.value.includes(p.id))
    const stream = request.stream
    results.value = []
    await Promise.allSettled(
      targets.map(provider => {
        let resultIndex: number | undefined

        return testProvider(provider, request, patch => {
          if (!stream) return

          if (resultIndex === undefined && patch.timeToFirstToken !== undefined) {
            resultIndex = results.value.length
            results.value.push({
              provider,
              stream: true,
              latency: 0,
              timeToFirstToken: patch.timeToFirstToken,
              status: 'running',
              outputText: '',
            })
          }

          if (resultIndex !== undefined) {
            const card = results.value[resultIndex]
            if (card) Object.assign(card, patch)
          }
        }).then(result => {
          if (!stream || resultIndex === undefined) {
            results.value.push(result)
          } else {
            const card = results.value[resultIndex]
            if (card) Object.assign(card, result)
          }
        })
      }),
    )
    running.value = false
  }

  return {
    request,
    selectedIds,
    running,
    results,
    toggle,
    runAll,
  }
}
