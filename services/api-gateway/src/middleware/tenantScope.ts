import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../shared/errors/AppError';

export const tenantScope = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.tenantId) {
    throw new ForbiddenError('Tenant context missing');
  }

  // Inject tenantId into request for easier access in controllers
  req.tenantId = req.user.tenantId;
  next();
};
