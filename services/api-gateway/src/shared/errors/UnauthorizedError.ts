import { AppError } from './AppError'

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401
  public readonly code = 'UNAUTHORIZED'

  constructor(message = 'Unauthorized') {
    super(message)
  }
}
