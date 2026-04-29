import { Job } from 'bullmq'
import pino from 'pino'
import { UsageAggregationJob } from '../queues/registry'

const logger = pino({ name: 'usageAggregation.processor' })

export async function processUsageAggregation(job: Job<UsageAggregationJob>): Promise<void> {
  const { tenantId, date } = job.data

  logger.info({ tenantId, date }, 'Usage aggregation ran for date')

  // TODO: Implement actual aggregation logic in rag-engine service
}
