import type OpenAI from 'openai'

export interface RelayProvider {
  id: string
  name: string
}

export type ReasoningEffort = Exclude<OpenAI.ReasoningEffort, null>

export interface TestRequest {
  model: OpenAI.Responses.ResponseCreateParams['model']
  reasoning: ReasoningEffort
  stream: boolean
  instructions: NonNullable<OpenAI.Responses.ResponseCreateParams['instructions']>
  completeInputs: OpenAI.Responses.EasyInputMessage[]
  streamInputs: OpenAI.Responses.EasyInputMessage[]
}

export interface TestResult {
  provider: RelayProvider
  stream: boolean
  latency: number
  timeToFirstToken?: number
  status: 'running' | 'success' | 'error'
  outputText: string
  usage?: OpenAI.Responses.ResponseUsage
  raw?: OpenAI.Responses.Response
  error?: string
}
