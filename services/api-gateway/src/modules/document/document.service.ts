import { Document } from '@prisma/client'
import { NotFoundError } from '../../shared/errors/AppError'
import { DocStatus, DocumentDto } from './document.types'
import { documentRepository } from './document.repository'

function toDto(doc: Document): DocumentDto {
  return {
    id: doc.id,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    url: doc.url,
    status: doc.status as DocStatus,
    tenantId: doc.tenantId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export class DocumentService {
  async listDocuments(
    tenantId: string,
    filters?: { status?: DocStatus },
  ): Promise<DocumentDto[]> {
    const docs = await documentRepository.findAll(tenantId, filters)
    return docs.map(toDto)
  }

  async getDocument(tenantId: string, documentId: string): Promise<DocumentDto> {
    const doc = await documentRepository.findById(tenantId, documentId)
    if (doc === null) {
      throw new NotFoundError('Document', documentId)
    }
    return toDto(doc)
  }

  async createDocument(
    tenantId: string,
    data: { name: string; type: string; size: number; url: string },
  ): Promise<DocumentDto> {
    const doc = await documentRepository.create(tenantId, data)
    return toDto(doc)
  }

  async updateDocumentStatus(
    tenantId: string,
    documentId: string,
    status: DocStatus,
  ): Promise<DocumentDto> {
    const doc = await documentRepository.updateStatus(tenantId, documentId, status)
    return toDto(doc)
  }

  async deleteDocument(tenantId: string, documentId: string): Promise<void> {
    const existing = await documentRepository.findById(tenantId, documentId)
    if (existing === null) {
      throw new NotFoundError('Document', documentId)
    }
    await documentRepository.delete(tenantId, documentId)
  }
}

export const documentService = new DocumentService()
