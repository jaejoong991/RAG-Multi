import { Conversation, Message } from '@prisma/client'
import { BadGatewayError, NotFoundError } from '../../shared/errors/AppError'
import { ConversationDto, ConversationWithMessagesDto, MessageDto, QueryResultDto } from './chat.types'
import { chatRepository } from './chat.repository'

const RAG_ENGINE_URL = process.env.RAG_ENGINE_URL ?? 'http://localhost:4001'
const INTERNAL_SECRET = process.env.INTERNAL_SECRET ?? ''

function toMessageDto(message: Message): MessageDto {
  return {
    id: message.id,
    role: message.role as 'user' | 'assistant',
    content: message.content,
    tokens: message.tokens ?? undefined,
    cost: message.cost?.toString() ?? undefined,
    latency: message.latency ?? undefined,
    createdAt: message.createdAt,
  }
}

function toConversationDto(
  conversation: Conversation & { messages?: Message[] },
): ConversationDto {
  return {
    id: conversation.id,
    tenantId: conversation.tenantId,
    externalId: conversation.externalId ?? undefined,
    messageCount: conversation.messages?.length ?? 0,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  }
}

function toConversationWithMessagesDto(
  conversation: Conversation & { messages: Message[] },
): ConversationWithMessagesDto {
  return {
    ...toConversationDto(conversation),
    messages: conversation.messages.map(toMessageDto),
  }
}

export class ChatService {
  async listConversations(
    tenantId: string,
    page: number,
    limit: number,
  ): Promise<{ data: ConversationDto[]; total: number }> {
    const { data, total } = await chatRepository.findConversations(tenantId, page, limit)
    return {
      data: data.map((c) => toConversationDto(c)),
      total,
    }
  }

  async getConversation(
    tenantId: string,
    conversationId: string,
  ): Promise<ConversationWithMessagesDto> {
    const conversation = await chatRepository.findConversationById(tenantId, conversationId)
    if (!conversation) {
      throw new NotFoundError('Conversation', conversationId)
    }
    return toConversationWithMessagesDto(conversation)
  }

  async createConversation(tenantId: string, externalId?: string): Promise<ConversationDto> {
    const conversation = await chatRepository.createConversation(tenantId, externalId)
    return toConversationDto(conversation)
  }

  async deleteConversation(tenantId: string, conversationId: string): Promise<void> {
    await chatRepository.deleteConversation(tenantId, conversationId)
  }

  async query(
    tenantId: string,
    query: string,
    conversationId?: string,
  ): Promise<QueryResultDto> {
    const conversation = conversationId
      ? await chatRepository.findConversationById(tenantId, conversationId)
      : null

    const activeConversation =
      conversation ?? (await chatRepository.createConversation(tenantId))

    await chatRepository.createMessage(activeConversation.id, 'user', query)

    const ragResponse = await fetch(`${RAG_ENGINE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': INTERNAL_SECRET,
      },
      body: JSON.stringify({
        tenantId,
        query,
        conversationId: activeConversation.id,
      }),
    })

    if (!ragResponse.ok) {
      throw new BadGatewayError('RAG engine request failed')
    }

    const ragData = (await ragResponse.json()) as { answer: string; sources: unknown[] }

    const assistantMessage = await chatRepository.createMessage(
      activeConversation.id,
      'assistant',
      ragData.answer,
    )

    return {
      answer: ragData.answer,
      sources: ragData.sources,
      conversationId: activeConversation.id,
      messageId: assistantMessage.id,
    }
  }
}

export const chatService = new ChatService()
