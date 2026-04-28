import { AppError } from './AppError'

export class NotFoundError extends AppError {
  public readonly statusCode = 404
  public readonly code = 'NOT_FOUND'

  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`)
  }
}
