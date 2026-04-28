import { z } from 'zod'

const DOC_STATUS_VALUES = ['UPLOADING', 'PROCESSING', 'INDEXED', 'FAILED'] as const

export const createDocumentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    type: z.string(),
    size: z.number().int().positive(),
    url: z.string().url(),
  }),
})

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(DOC_STATUS_VALUES),
  }),
})
