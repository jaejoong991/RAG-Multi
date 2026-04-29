export interface ConversationDto {
  id: string
  tenantId: string
  externalId?: string
  messageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MessageDto {
  id: string
  role: 'user' | 'assistant'
  content: string
  tokens?: number
  cost?: string
  latency?: number
  createdAt: Date
}

export interface ConversationWithMessagesDto extends ConversationDto {
  messages: MessageDto[]
}

export interface QueryResultDto {
  answer: string
  sources: unknown[]
  conversationId: string
  messageId: string
}
