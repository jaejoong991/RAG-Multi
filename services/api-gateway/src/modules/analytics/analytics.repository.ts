import prisma from '../../config/database'
import { DailyUsageDto, UsageSummaryDto } from './analytics.types'

export class AnalyticsRepository {
  async getUsageSummary(tenantId: string, from: Date, to: Date): Promise<UsageSummaryDto> {
    const [countAndTokens, costResult, latencyResult] = await Promise.all([
      prisma.usageLog.aggregate({
        where: { tenantId, createdAt: { gte: from, lte: to } },
        _count: { id: true },
        _sum: { tokens: true },
      }),
      prisma.usageLog.aggregate({
        where: { tenantId, createdAt: { gte: from, lte: to } },
        _sum: { cost: true },
      }),
      prisma.message.aggregate({
        where: {
          conversation: { tenantId },
          createdAt: { gte: from, lte: to },
          latency: { not: null },
        },
        _avg: { latency: true },
      }),
    ])

    return {
      totalQueries: countAndTokens._count.id,
      totalTokens: countAndTokens._sum.tokens ?? 0,
      totalCost: costResult._sum.cost?.toString() ?? '0',
      avgLatency: latencyResult._avg.latency ?? 0,
    }
  }

  async getDailyUsage(tenantId: string, from: Date, to: Date): Promise<DailyUsageDto[]> {
    const groups = await prisma.usageLog.groupBy({
      by: ['createdAt'],
      where: { tenantId, createdAt: { gte: from, lte: to } },
      _count: { id: true },
      _sum: { tokens: true, cost: true },
      orderBy: { createdAt: 'asc' },
    })

    const dailyMap = new Map<string, { queries: number; tokens: number; cost: number }>()

    for (const group of groups) {
      const date = group.createdAt.toISOString().slice(0, 10)
      const existing = dailyMap.get(date)
      const queries = group._count.id
      const tokens = group._sum.tokens ?? 0
      const cost = Number(group._sum.cost ?? 0)

      if (existing !== undefined) {
        dailyMap.set(date, {
          queries: existing.queries + queries,
          tokens: existing.tokens + tokens,
          cost: existing.cost + cost,
        })
      } else {
        dailyMap.set(date, { queries, tokens, cost })
      }
    }

    return Array.from(dailyMap.entries()).map(([date, totals]) => ({
      date,
      queries: totals.queries,
      tokens: totals.tokens,
      cost: totals.cost.toFixed(5),
    }))
  }
}

export const analyticsRepository = new AnalyticsRepository()
