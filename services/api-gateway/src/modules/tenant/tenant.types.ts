export type TenantPlan = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'

export interface TenantDto {
  id: string
  name: string
  plan: TenantPlan
  createdAt: Date
}
