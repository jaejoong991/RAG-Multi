import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../../shared/errors/AppError'
import { parsePaginationQuery } from '../../shared/utils/pagination'
import { DocStatus } from './document.types'
import { documentService } from './document.service'

export class DocumentController {
  async listDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const { page, limit, skip } = parsePaginationQuery(req.query)
      const statusFilter =
        typeof req.query.status === 'string'
          ? (req.query.status as DocStatus)
          : undefined

      const docs = await documentService.listDocuments(tenantId, { status: statusFilter })
      const total = docs.length
      const paginated = docs.slice(skip, skip + limit)

      res.json({
        success: true,
        data: paginated,
        meta: { total, page, limit },
      })
    } catch (error) {
      next(error)
    }
  }

  async getDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const data = await documentService.getDocument(tenantId, req.params.id)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async createDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const data = await documentService.createDocument(tenantId, req.body)
      res.status(201).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async updateDocumentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const data = await documentService.updateDocumentStatus(
        tenantId,
        req.params.id,
        req.body.status as DocStatus,
      )
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      await documentService.deleteDocument(tenantId, req.params.id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

export const documentController = new DocumentController()
