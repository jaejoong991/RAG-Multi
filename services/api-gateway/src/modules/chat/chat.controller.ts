import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../../shared/errors/AppError'
import { parsePaginationQuery } from '../../shared/utils/pagination'
import { chatService } from './chat.service'

export class ChatController {
  async listConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const { page, limit } = parsePaginationQuery(req.query)
      const { data, total } = await chatService.listConversations(tenantId, page, limit)

      res.json({
        success: true,
        data,
        meta: { total, page, limit },
      })
    } catch (error) {
      next(error)
    }
  }

  async getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const data = await chatService.getConversation(tenantId, req.params.id)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async createConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const externalId: string | undefined = req.body.externalId
      const data = await chatService.createConversation(tenantId, externalId)

      res.status(201).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      await chatService.deleteConversation(tenantId, req.params.id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  async query(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing')
      }

      const { query, conversationId } = req.body as {
        query: string
        conversationId?: string
      }

      const data = await chatService.query(tenantId, query, conversationId)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }
}

export const chatController = new ChatController()
