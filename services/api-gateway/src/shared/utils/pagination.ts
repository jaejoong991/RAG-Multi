const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

interface PaginationParams {
  page: number
  limit: number
  skip: number
}

interface RawQuery {
  page?: unknown
  limit?: unknown
}

export function parsePaginationQuery(query: RawQuery): PaginationParams {
  const rawPage = Number(query.page)
  const rawLimit = Number(query.limit)

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : DEFAULT_PAGE
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(Math.floor(rawLimit), MAX_LIMIT)
    : DEFAULT_LIMIT
  const skip = (page - 1) * limit

  return { page, limit, skip }
}
