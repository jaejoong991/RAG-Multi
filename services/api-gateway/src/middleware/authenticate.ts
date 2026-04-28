import { Request, Response, NextFunction } from 'express'
import { firebaseAdmin } from '../config/firebase'
import prisma from '../config/database'
import { UnauthorizedError } from '../shared/errors/AppError'
import logger from '../shared/utils/logger'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication token missing'))
  }

  const token = authHeader.slice(7)

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token)

    const user = await prisma.user.findUnique({
      where: { email: decoded.email ?? '' },
      select: { id: true, tenantId: true, role: true },
    })

    if (!user) {
      return next(new UnauthorizedError('User not found'))
    }

    req.user = {
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
    }

    return next()
  } catch (err: unknown) {
    logger.warn({ err }, 'Firebase token verification failed')
    return next(new UnauthorizedError('Invalid or expired token'))
  }
}
