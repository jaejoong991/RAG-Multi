import Redis from 'ioredis'
import { env } from './env'
import logger from '../shared/utils/logger'

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableReadyCheck: true,
})

redis.on('connect', () => {
  logger.info('Redis connected')
})

redis.on('error', (err: Error) => {
  logger.error({ err }, 'Redis connection error')
})

redis.on('close', () => {
  logger.warn('Redis connection closed')
})

export default redis
