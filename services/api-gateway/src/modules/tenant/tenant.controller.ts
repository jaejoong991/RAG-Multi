import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/AppError';
import { tenantService } from './tenant.service';

export class TenantController {
  async getTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId } = req.params;
      if (req.user?.tenantId !== tenantId) {
        throw new ForbiddenError('Access denied to this tenant');
      }
      const data = await tenantService.getTenant(tenantId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async updateTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId } = req.params;
      if (req.user?.tenantId !== tenantId) {
        throw new ForbiddenError('Access denied to this tenant');
      }
      const data = await tenantService.updateTenant(tenantId, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const tenantController = new TenantController();
