import 'dotenv/config'
import { Worker } from 'bullmq'
import pino from 'pino'
import { redis } from './config/redis'
import { QUEUES, IndexDocumentJob, DeleteDocumentJob, UsageAggregationJob } from './queues/registry'
import { processIndexDocument } from './processors/indexDocument.processor'
import { processDeleteDocument } from './processors/deleteDocument.processor'
import { processUsageAggregation } from './processors/usageAggregation.processor'

const logger = pino({ name: 'worker' })

function bootstrap(): void {
  const indexWorker = new Worker<IndexDocumentJob>(
    QUEUES.INDEX_DOCUMENT,
    processIndexDocument,
    { connection: redis }
  )

  const deleteWorker = new Worker<DeleteDocumentJob>(
    QUEUES.DELETE_DOCUMENT,
    processDeleteDocument,
    { connection: redis }
  )

  const aggregationWorker = new Worker<UsageAggregationJob>(
    QUEUES.USAGE_AGGREGATION,
    processUsageAggregation,
    { connection: redis }
  )

  for (const worker of [indexWorker, deleteWorker, aggregationWorker]) {
    worker.on('completed', (job) => {
      logger.info({ jobId: job.id, queue: job.queueName }, 'Job completed')
    })
    worker.on('failed', (job, err) => {
      logger.error({ jobId: job?.id, queue: job?.queueName, err }, 'Job failed')
    })
  }

  logger.info('Worker service started — listening on 3 queues')

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully')
    await Promise.all([indexWorker.close(), deleteWorker.close(), aggregationWorker.close()])
    process.exit(0)
  })
}

bootstrap()
