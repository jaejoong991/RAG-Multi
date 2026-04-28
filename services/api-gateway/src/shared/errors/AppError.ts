export abstract class AppError extends Error {
  public abstract readonly statusCode: number
  public abstract readonly code: string

  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}

// Re-export all typed error classes so existing imports from this path continue to work
export { NotFoundError } from './NotFoundError'
export { UnauthorizedError } from './UnauthorizedError'
export { ForbiddenError } from './ForbiddenError'
export { ValidationError } from './ValidationError'
