export type DocStatus = 'UPLOADING' | 'PROCESSING' | 'INDEXED' | 'FAILED'

export interface DocumentDto {
  id: string
  name: string
  type: string
  size: number
  url: string
  status: DocStatus
  tenantId: string
  createdAt: Date
  updatedAt: Date
}
