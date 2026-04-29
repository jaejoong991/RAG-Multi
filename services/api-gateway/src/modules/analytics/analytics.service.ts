import { DailyUsageDto, UsageSummaryDto } from './analytics.types'
import { analyticsRepository } from './analytics.repository'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

interface DateRange {
  from: Date
  to: Date
}

function parseDateRange(query: { from?: unknown; to?: unknown }): DateRange {
  const now = new Date()
  const defaultFrom = new Date(now.getTime() - THIRTY_DAYS_MS)

  const from =
    typeof query.from === 'string' && query.from.length > 0
      ? new Date(query.from)
      : defaultFrom

  const to =
    typeof query.to === 'string' && query.to.length > 0
      ? new Date(query.to)
      : now

  return {
    from: isNaN(from.getTime()) ? defaultFrom : from,
    to: isNaN(to.getTime()) ? now : to,
  }
}

export class AnalyticsService {
  async getSummary(
    tenantId: string,
    query: { from?: unknown; to?: unknown },
  ): Promise<UsageSummaryDto> {
    const { from, to } = parseDateRange(query)
    return analyticsRepository.getUsageSummary(tenantId, from, to)
  }

  async getDailyUsage(
    tenantId: string,
    query: { from?: unknown; to?: unknown },
  ): Promise<DailyUsageDto[]> {
    const { from, to } = parseDateRange(query)
    return analyticsRepository.getDailyUsage(tenantId, from, to)
  }
}

export const analyticsService = new AnalyticsService()
