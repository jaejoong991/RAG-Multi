import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../../shared/errors/AppError'
import { analyticsService } from './analytics.service'

export class AnalyticsController {
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const data = await analyticsService.getSummary(tenantId, req.query)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async getDailyUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const data = await analyticsService.getDailyUsage(tenantId, req.query)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }
}

export const analyticsController = new AnalyticsController()
