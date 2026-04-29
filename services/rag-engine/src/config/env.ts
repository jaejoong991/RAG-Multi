import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),
  API_GATEWAY_URL: z.string().url().default('http://localhost:4000'),
  INTERNAL_SECRET: z.string().min(1),
})

export const env = schema.parse(process.env)
