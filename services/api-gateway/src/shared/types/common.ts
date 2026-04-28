export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: ResponseMeta
}

export interface ResponseMeta {
  total: number
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: ResponseMeta
}
