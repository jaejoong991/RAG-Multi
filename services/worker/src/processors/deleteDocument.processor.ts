import { Job } from 'bullmq'
import { PrismaClient } from '@prisma/client'
import pino from 'pino'
import { DeleteDocumentJob } from '../queues/registry'

const logger = pino({ name: 'deleteDocument.processor' })
const prisma = new PrismaClient()

export async function processDeleteDocument(job: Job<DeleteDocumentJob>): Promise<void> {
  const { documentId, tenantId } = job.data

  logger.info({ documentId, tenantId }, 'Starting document deletion')

  const result = await prisma.chunk.deleteMany({
    where: { documentId },
  })

  logger.info({ documentId, tenantId, chunksDeleted: result.count }, 'Document chunks deleted')
}
