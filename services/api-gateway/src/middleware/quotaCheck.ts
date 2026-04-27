import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../shared/errors/AppError';
import prisma from '../config/database';
import { PLAN_LIMITS } from '@rag-multi/shared/src/constants/plans';
import logger from '../shared/utils/logger';

export const quotaCheck = (resource: 'queries' | 'documents') => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantId = req.tenantId;

  if (!tenantId) {
    return next(new ForbiddenError('Tenant context missing'));
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return next(new ForbiddenError('Tenant not found'));
    }

    const limits = PLAN_LIMITS[tenant.plan];

    if (resource === 'queries') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const usageCount = await prisma.usageLog.count({
        where: {
          tenantId,
          type: 'query',
          createdAt: { gte: startOfMonth },
        },
      });

      if (usageCount >= limits.queriesPerMonth) {
        logger.warn({ tenantId, usageCount, limit: limits.queriesPerMonth }, 'Query quota exceeded');
        return next(new ForbiddenError('Monthly query quota exceeded. Please upgrade your plan.'));
      }
    }

    if (resource === 'documents') {
      const docCount = await prisma.document.count({
        where: { tenantId },
      });

      if (docCount >= limits.documentsCount) {
        logger.warn({ tenantId, docCount, limit: limits.documentsCount }, 'Document quota exceeded');
        return next(new ForbiddenError('Document storage quota exceeded. Please upgrade your plan.'));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
