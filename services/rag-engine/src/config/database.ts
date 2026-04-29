import { PrismaClient } from '@prisma/client'
import pino from 'pino'

const logger = pino({ name: 'rag-engine:prisma' })

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
})

prisma.$on('query', (e) => {
  logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query')
})

export default prisma
