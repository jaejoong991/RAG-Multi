export const QUEUES = {
  INDEX_DOCUMENT: 'index-document',
  DELETE_DOCUMENT: 'delete-document',
  USAGE_AGGREGATION: 'usage-aggregation',
} as const

export interface IndexDocumentJob {
  documentId: string
  tenantId: string
  fileUrl: string
  fileType: string
}

export interface DeleteDocumentJob {
  documentId: string
  tenantId: string
}

export interface UsageAggregationJob {
  tenantId: string
  date: string // ISO date string YYYY-MM-DD
}
