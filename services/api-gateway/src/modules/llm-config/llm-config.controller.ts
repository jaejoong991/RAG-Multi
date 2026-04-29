import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../shared/errors/AppError';
import { UpdateLLMConfigDto } from './llm-config.types';
import { llmConfigService } from './llm-config.service';

export class LLMConfigController {
  async getConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing');
      }
      const data = await llmConfigService.getConfig(tenantId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getConfigInternal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const secret = req.headers['x-internal-secret']
      if (!secret || secret !== process.env.INTERNAL_SECRET) {
        res.status(401).json({ success: false, error: 'Unauthorized' })
        return
      }
      const { tenantId } = req.params
      const data = await llmConfigService.resolveForRAG(tenantId)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        throw new UnauthorizedError('Tenant context missing');
      }
      const dto: UpdateLLMConfigDto = req.body;
      const data = await llmConfigService.updateConfig(tenantId, dto);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const llmConfigController = new LLMConfigController();
