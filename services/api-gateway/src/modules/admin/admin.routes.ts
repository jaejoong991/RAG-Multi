import { Router, Request, Response, NextFunction } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { ForbiddenError } from '../../shared/errors/AppError'
import { adminController } from './admin.controller'

const router = Router()

const requireSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return next(new ForbiddenError('Super admin access required'))
  }
  next()
}

router.get(
  '/tenants',
  authenticate,
  requireSuperAdmin,
  adminController.listTenants.bind(adminController),
)
router.get(
  '/stats',
  authenticate,
  requireSuperAdmin,
  adminController.getPlatformStats.bind(adminController),
)
router.delete(
  '/tenants/:tenantId',
  authenticate,
  requireSuperAdmin,
  adminController.deleteTenant.bind(adminController),
)

export default router
