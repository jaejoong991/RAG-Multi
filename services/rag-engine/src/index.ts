import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pino from 'pino'
import { env } from './config/env'
import indexRoute from './routes/index.route'
import queryRoute from './routes/query.route'

const logger = pino({ name: 'rag-engine' })
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/index', indexRoute)
app.use('/query', queryRoute)

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'RAG Engine started')
})
