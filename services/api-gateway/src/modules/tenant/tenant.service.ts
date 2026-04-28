import { Tenant } from '@prisma/client';
import { NotFoundError } from '../../shared/errors/AppError';
import { TenantDto, TenantPlan } from './tenant.types';
import { tenantRepository } from './tenant.repository';

function toDto(tenant: Tenant): TenantDto {
  return {
    id: tenant.id,
    name: tenant.name,
    plan: tenant.plan as TenantPlan,
    createdAt: tenant.createdAt,
  };
}

export class TenantService {
  async getTenant(tenantId: string): Promise<TenantDto> {
    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError('Tenant', tenantId);
    }
    return toDto(tenant);
  }

  async updateTenant(
    tenantId: string,
    data: Partial<{ name: string; plan: TenantPlan }>,
  ): Promise<TenantDto> {
    const existing = await tenantRepository.findById(tenantId);
    if (!existing) {
      throw new NotFoundError('Tenant', tenantId);
    }
    const updated = await tenantRepository.update(tenantId, data);
    return toDto(updated);
  }
}

export const tenantService = new TenantService();
