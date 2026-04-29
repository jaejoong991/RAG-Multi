import { TenantSummaryDto, PlatformStatsDto } from './admin.types'
import { adminRepository } from './admin.repository'

export class AdminService {
  async listTenants(): Promise<TenantSummaryDto[]> {
    return adminRepository.listTenantsSummary()
  }

  async getPlatformStats(): Promise<PlatformStatsDto> {
    return adminRepository.getPlatformStats()
  }

  async deleteTenant(tenantId: string): Promise<void> {
    return adminRepository.deleteTenant(tenantId)
  }
}

export const adminService = new AdminService()
