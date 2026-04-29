import { AppError } from './AppError'

export class BadGatewayError extends AppError {
  public readonly statusCode = 502
  public readonly code = 'BAD_GATEWAY'

  constructor(message = 'Upstream service unavailable') {
    super(message)
  }
}
