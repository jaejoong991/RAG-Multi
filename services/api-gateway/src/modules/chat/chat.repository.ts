import { Conversation, Message } from '@prisma/client'
import prisma from '../../config/database'

export class ChatRepository {
  async findConversations(
    tenantId: string,
    page: number,
    limit: number,
  ): Promise<{ data: Conversation[]; total: number }> {
    const skip = (page - 1) * limit

    const [data, total] = await prisma.$transaction([
      prisma.conversation.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.conversation.count({ where: { tenantId } }),
    ])

    return { data, total }
  }

  async findConversationById(
    tenantId: string,
    conversationId: string,
  ): Promise<(Conversation & { messages: Message[] }) | null> {
    return prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    })
  }

  async createConversation(tenantId: string, externalId?: string): Promise<Conversation> {
    return prisma.conversation.create({
      data: {
        tenantId,
        ...(externalId !== undefined ? { externalId } : {}),
      },
    })
  }

  async getMessages(tenantId: string, conversationId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: {
        conversationId,
        conversation: { tenantId },
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  async createMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
  ): Promise<Message> {
    return prisma.message.create({
      data: { conversationId, role, content },
    })
  }

  async deleteConversation(tenantId: string, conversationId: string): Promise<void> {
    await prisma.conversation.deleteMany({
      where: { id: conversationId, tenantId },
    })
  }
}

export const chatRepository = new ChatRepository()
