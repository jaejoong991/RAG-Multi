import { Router, Request, Response } from 'express'
import { z } from 'zod'
import pino from 'pino'
import prisma from '../config/database'
import { LLMFactory } from '../providers/LLMFactory'
import { EmbeddingService } from '../services/embedding.service'
import { RetrievalService } from '../services/retrieval.service'
import { GenerationService } from '../services/generation.service'
import { QueryPipeline } from '../pipelines/queryPipeline'
import { env } from '../config/env'

const router = Router()
const logger = pino({ name: 'rag-engine:query-route' })

const queryBodySchema = z.object({
  tenantId: z.string().min(1),
  query: z.string().min(1),
  conversationId: z.string().optional(),
})

type QueryBody = z.infer<typeof queryBodySchema>

interface TenantLLMConfig {
  mode: 'MANAGED' | 'BYOK' | 'BYOE'
  provider: string
  model: string
  apiKey?: string
  endpointUrl?: string
  temperature: number
  systemPrompt?: string
}

async function fetchTenantLLMConfig(tenantId: string): Promise<TenantLLMConfig> {
  const response = await fetch(`${env.API_GATEWAY_URL}/api/v1/llm-config/internal/${tenantId}`, {
    headers: { 'X-Internal-Secret': env.INTERNAL_SECRET },
  })

  if (!response.ok) {
    logger.warn({ tenantId }, 'Failed to fetch tenant LLM config, using defaults')
    return { mode: 'MANAGED', provider: 'openai', model: 'gpt-4o-mini', temperature: 0.7 }
  }

  const data = (await response.json()) as { data: TenantLLMConfig }
  return data.data
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parseResult = queryBodySchema.safeParse(req.body)
  if (!parseResult.success) {
    res.status(400).json({ success: false, error: parseResult.error.message })
    return
  }

  const body: QueryBody = parseResult.data

  try {
    const llmConfig = await fetchTenantLLMConfig(body.tenantId)

    const llm = LLMFactory.create({
      provider: llmConfig.provider as 'openai' | 'google' | 'anthropic' | 'ollama',
      modelName: llmConfig.model,
      temperature: llmConfig.temperature,
      apiKey: llmConfig.apiKey,
      endpointUrl: llmConfig.endpointUrl,
    })

    const embeddingService = new EmbeddingService({ provider: 'openai', modelName: 'text-embedding-ada-002' })
    const retrievalService = new RetrievalService(embeddingService)
    const generationService = new GenerationService(llm)
    const pipeline = new QueryPipeline(retrievalService, generationService)

    const result = await pipeline.run(body.tenantId, body.query, llmConfig.systemPrompt)

    await prisma.usageLog.create({
      data: {
        type: 'query',
        tokens: result.usage?.totalTokens ?? 0,
        cost: result.usage?.cost ?? 0,
        model: llmConfig.model,
        tenantId: body.tenantId,
      },
    })

    logger.info({ tenantId: body.tenantId, tokens: result.usage?.totalTokens }, 'Query completed')
    res.json({ success: true, data: result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during query'
    logger.error({ tenantId: body.tenantId, error: message }, 'Query failed')
    res.status(500).json({ success: false, error: message })
  }
})

export default router
