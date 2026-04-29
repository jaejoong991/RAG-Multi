import { Request, Response, NextFunction } from 'express'
import { adminService } from './admin.service'

export class AdminController {
  async listTenants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.listTenants()
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async getPlatformStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getPlatformStats()
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminService.deleteTenant(req.params.tenantId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

export const adminController = new AdminController()
