export interface UsageSummaryDto {
  totalQueries: number
  totalTokens: number
  totalCost: string
  avgLatency: number
}

export interface DailyUsageDto {
  date: string
  queries: number
  tokens: number
  cost: string
}
