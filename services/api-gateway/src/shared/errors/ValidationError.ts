import { AppError } from './AppError'

export class ValidationError extends AppError {
  public readonly statusCode = 422
  public readonly code = 'VALIDATION_ERROR'

  constructor(message: string, details?: unknown) {
    super(message, details)
  }
}
