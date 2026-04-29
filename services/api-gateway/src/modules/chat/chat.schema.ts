import { z } from 'zod'

export const createConversationSchema = z.object({
  body: z.object({
    externalId: z.string().optional(),
  }),
})

export const querySchema = z.object({
  body: z.object({
    query: z.string().min(1),
    conversationId: z.string().optional(),
  }),
})
