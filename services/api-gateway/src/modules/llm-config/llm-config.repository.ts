import { TenantLLMConfig, Prisma } from '@prisma/client';
import prisma from '../../config/database';

export class LLMConfigRepository {
  async findByTenantId(tenantId: string): Promise<TenantLLMConfig | null> {
    return prisma.tenantLLMConfig.findUnique({
      where: { tenantId },
    });
  }

  async upsert(
    tenantId: string,
    data: Prisma.TenantLLMConfigUpdateInput,
  ): Promise<TenantLLMConfig> {
    return prisma.tenantLLMConfig.upsert({
      where: { tenantId },
      update: data,
      create: {
        tenant: { connect: { id: tenantId } },
        ...data,
      } as Prisma.TenantLLMConfigCreateInput,
    });
  }
}

export const llmConfigRepository = new LLMConfigRepository();
