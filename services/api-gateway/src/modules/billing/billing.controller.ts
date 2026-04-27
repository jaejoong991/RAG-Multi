import { Request, Response, NextFunction } from 'express';
import { billingService } from './billing.service';

export class BillingController {
  async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { priceId } = req.body;
      const tenantId = req.tenantId!; // Injected by tenantScope middleware
      const result = await billingService.createCheckoutSession(tenantId, priceId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers['stripe-signature'] as string;
      // Stripe webhooks need raw body
      const body = (req as any).rawBody || req.body;
      await billingService.handleWebhook(sig, body);
      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}

export const billingController = new BillingController();
