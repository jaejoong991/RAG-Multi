import { Job } from 'bullmq'
import { PrismaClient } from '@prisma/client'
import pino from 'pino'
import { IndexDocumentJob } from '../queues/registry'

const logger = pino({ name: 'indexDocument.processor' })
const prisma = new PrismaClient()

const RAG_ENGINE_URL = process.env.RAG_ENGINE_URL || 'http://localhost:4001'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Unexpected error'
}

export async function processIndexDocument(job: Job<IndexDocumentJob>): Promise<void> {
  const { documentId, tenantId, fileUrl, fileType } = job.data

  await prisma.document.update({
    where: { id: documentId },
    data: { status: 'PROCESSING' },
  })

  logger.info({ documentId, tenantId }, 'Starting document indexing')

  try {
    const response = await fetch(`${RAG_ENGINE_URL}/index`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, tenantId, fileUrl, fileType }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`RAG engine responded with ${response.status}: ${text}`)
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'INDEXED' },
    })

    logger.info({ documentId, tenantId }, 'Document indexed successfully')
  } catch (error: unknown) {
    const message = getErrorMessage(error)

    logger.error({ documentId, tenantId, err: message }, 'Document indexing failed')

    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'FAILED' },
    })

    throw error
  }
}
