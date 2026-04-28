import { Document } from '@prisma/client'
import prisma from '../../config/database'
import { DocStatus } from './document.types'

export class DocumentRepository {
  async findAll(tenantId: string, filters?: { status?: DocStatus }): Promise<Document[]> {
    return prisma.document.findMany({
      where: {
        tenantId,
        ...(filters?.status !== undefined ? { status: filters.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(tenantId: string, documentId: string): Promise<Document | null> {
    return prisma.document.findFirst({
      where: { id: documentId, tenantId },
    })
  }

  async create(
    tenantId: string,
    data: { name: string; type: string; size: number; url: string },
  ): Promise<Document> {
    return prisma.document.create({
      data: { ...data, tenantId },
    })
  }

  async updateStatus(
    tenantId: string,
    documentId: string,
    status: DocStatus,
  ): Promise<Document> {
    return prisma.document.update({
      where: { id: documentId, tenantId },
      data: { status },
    })
  }

  async delete(tenantId: string, documentId: string): Promise<void> {
    await prisma.document.delete({
      where: { id: documentId, tenantId },
    })
  }
}

export const documentRepository = new DocumentRepository()
