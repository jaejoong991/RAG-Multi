import { Router } from 'express';
import { billingController } from './billing.controller';
import { authenticate } from '../../middleware/authenticate';
import { tenantScope } from '../../middleware/tenantScope';

const router = Router();

// Public webhook
router.post('/webhook', billingController.webhook);

// Protected checkout
router.post('/checkout', authenticate, tenantScope, billingController.createCheckoutSession);

export default router;
