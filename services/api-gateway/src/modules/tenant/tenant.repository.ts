import { Tenant } from '@prisma/client';
import prisma from '../../config/database';
import { TenantPlan } from './tenant.types';

export class TenantRepository {
  async findById(tenantId: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: { id: tenantId },
    });
  }

  async findAll(filters?: { plan?: TenantPlan }): Promise<Tenant[]> {
    return prisma.tenant.findMany({
      where: filters?.plan ? { plan: filters.plan } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { name: string }): Promise<Tenant> {
    return prisma.tenant.create({
      data: { name: data.name },
    });
  }

  async update(
    tenantId: string,
    data: Partial<{ name: string; plan: TenantPlan }>,
  ): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id: tenantId },
      data,
    });
  }

  async delete(tenantId: string): Promise<void> {
    await prisma.tenant.delete({
      where: { id: tenantId },
    });
  }
}

export const tenantRepository = new TenantRepository();
