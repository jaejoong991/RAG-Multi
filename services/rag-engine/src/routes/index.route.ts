import { Router, Request, Response } from 'express'
import { z } from 'zod'
import pino from 'pino'
import prisma from '../config/database'
import { IndexPipeline } from '../pipelines/indexPipeline'
import { EmbeddingService } from '../services/embedding.service'

const router = Router()
const logger = pino({ name: 'rag-engine:index-route' })

const indexBodySchema = z.object({
  documentId: z.string().min(1),
  tenantId: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string().min(1),
})

type IndexBody = z.infer<typeof indexBodySchema>

async function fetchDocumentText(fileUrl: string): Promise<string> {
  const response = await fetch(fileUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`)
  }
  return response.text()
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parseResult = indexBodySchema.safeParse(req.body)
  if (!parseResult.success) {
    res.status(400).json({ success: false, error: parseResult.error.message })
    return
  }

  const body: IndexBody = parseResult.data

  try {
    const text = await fetchDocumentText(body.fileUrl)

    const embeddingService = new EmbeddingService({
      provider: 'openai',
      modelName: 'text-embedding-ada-002',
    })

    const pipeline = new IndexPipeline(embeddingService)
    const chunks = await pipeline.run(text, {
      documentId: body.documentId,
      tenantId: body.tenantId,
      fileType: body.fileType,
    })

    await Promise.all(
      chunks.map((chunk) =>
        prisma.$executeRawUnsafe(
          `INSERT INTO document_chunks (id, content, metadata, embedding, "documentId", "createdAt")
           VALUES (gen_random_uuid(), $1, $2::jsonb, $3::vector, $4, NOW())`,
          chunk.content,
          JSON.stringify(chunk.metadata),
          `[${chunk.embedding.join(',')}]`,
          body.documentId
        )
      )
    )

    await prisma.document.update({
      where: { id: body.documentId },
      data: { status: 'INDEXED' },
    })

    logger.info(
      { documentId: body.documentId, chunkCount: chunks.length },
      'Document indexed successfully'
    )

    res.json({ success: true, chunkCount: chunks.length })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during indexing'
    logger.error({ documentId: body.documentId, error: message }, 'Indexing failed')

    try {
      await prisma.document.update({
        where: { id: body.documentId },
        data: { status: 'FAILED' },
      })
    } catch (updateError: unknown) {
      const updateMessage =
        updateError instanceof Error ? updateError.message : 'Unknown error updating status'
      logger.error(
        { documentId: body.documentId, error: updateMessage },
        'Failed to update document status to FAILED'
      )
    }

    res.status(500).json({ success: false, error: message })
  }
})

export default router
