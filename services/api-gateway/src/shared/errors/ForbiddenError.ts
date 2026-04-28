import { AppError } from './AppError'

export class ForbiddenError extends AppError {
  public readonly statusCode = 403
  public readonly code = 'FORBIDDEN'

  constructor(message = 'Forbidden') {
    super(message)
  }
}
