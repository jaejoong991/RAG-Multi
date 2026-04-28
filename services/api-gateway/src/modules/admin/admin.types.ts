export interface TenantSummaryDto {
  id: string
  name: string
  plan: string
  userCount: number
  documentCount: number
  totalQueries: number
  createdAt: Date
}

export interface PlatformStatsDto {
  totalTenants: number
  totalUsers: number
  totalDocuments: number
  totalQueries: number
  totalCost: string
}
