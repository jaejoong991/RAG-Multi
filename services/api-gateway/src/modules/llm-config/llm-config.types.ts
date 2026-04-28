export type LLMMode = 'MANAGED' | 'BYOK' | 'BYOE'

export interface LLMConfigDto {
  tenantId: string
  mode: LLMMode
  provider: string
  model: string
  endpointUrl?: string
  temperature: number
  systemPrompt?: string
  hasApiKey: boolean // never expose raw/encrypted key
}

export interface UpdateLLMConfigDto {
  mode?: LLMMode
  provider?: string
  model?: string
  apiKey?: string // plain text — service encrypts before save
  endpointUrl?: string
  temperature?: number
  systemPrompt?: string
}
