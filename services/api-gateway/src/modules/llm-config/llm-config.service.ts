import { TenantLLMConfig } from '@prisma/client';
import { NotFoundError } from '../../shared/errors/AppError';
import { encrypt, decrypt } from '../../shared/utils/crypto';
import { LLMConfigDto, LLMMode, UpdateLLMConfigDto } from './llm-config.types';
import { llmConfigRepository } from './llm-config.repository';

interface RAGConfig {
  mode: LLMMode;
  provider: string;
  model: string;
  apiKey?: string;
  endpointUrl?: string;
  temperature: number;
  systemPrompt?: string;
}

function toDto(config: TenantLLMConfig): LLMConfigDto {
  return {
    tenantId: config.tenantId,
    mode: config.mode as LLMMode,
    provider: config.provider,
    model: config.model,
    endpointUrl: config.endpointUrl ?? undefined,
    temperature: config.temperature,
    systemPrompt: config.systemPrompt ?? undefined,
    hasApiKey: config.apiKeyEnc !== null,
  };
}

export class LLMConfigService {
  async getConfig(tenantId: string): Promise<LLMConfigDto> {
    const config = await llmConfigRepository.findByTenantId(tenantId);
    if (!config) {
      throw new NotFoundError('LLMConfig', tenantId);
    }
    return toDto(config);
  }

  async updateConfig(tenantId: string, dto: UpdateLLMConfigDto): Promise<LLMConfigDto> {
    const { apiKey, ...rest } = dto;

    const updateData = {
      ...rest,
      ...(apiKey !== undefined ? { apiKeyEnc: encrypt(apiKey) } : {}),
    };

    const updated = await llmConfigRepository.upsert(tenantId, updateData);
    return toDto(updated);
  }

  async resolveForRAG(tenantId: string): Promise<RAGConfig> {
    const config = await llmConfigRepository.findByTenantId(tenantId);
    if (!config) {
      throw new NotFoundError('LLMConfig', tenantId);
    }

    return {
      mode: config.mode as LLMMode,
      provider: config.provider,
      model: config.model,
      apiKey: config.apiKeyEnc ? decrypt(config.apiKeyEnc) : undefined,
      endpointUrl: config.endpointUrl ?? undefined,
      temperature: config.temperature,
      systemPrompt: config.systemPrompt ?? undefined,
    };
  }
}

export const llmConfigService = new LLMConfigService();
