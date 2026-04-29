import prisma from '../../config/database'
import { TenantSummaryDto, PlatformStatsDto } from './admin.types'

export class AdminRepository {
  async listTenantsSummary(): Promise<TenantSummaryDto[]> {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            documents: true,
          },
        },
        usageLogs: {
          where: { type: 'query' },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      plan: tenant.plan,
      userCount: tenant._count.users,
      documentCount: tenant._count.documents,
      totalQueries: tenant.usageLogs.length,
      createdAt: tenant.createdAt,
    }))
  }

  async getPlatformStats(): Promise<PlatformStatsDto> {
    const [totalTenants, totalUsers, totalDocuments, queryAgg] = await prisma.$transaction([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.document.count(),
      prisma.usageLog.aggregate({
        where: { type: 'query' },
        _count: { id: true },
        _sum: { cost: true },
      }),
    ])

    return {
      totalTenants,
      totalUsers,
      totalDocuments,
      totalQueries: queryAgg._count.id,
      totalCost: (queryAgg._sum.cost ?? 0).toString(),
    }
  }

  async deleteTenant(tenantId: string): Promise<void> {
    await prisma.tenant.delete({ where: { id: tenantId } })
  }
}

export const adminRepository = new AdminRepository()
