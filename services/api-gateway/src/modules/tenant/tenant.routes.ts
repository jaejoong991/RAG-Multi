import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { tenantController } from './tenant.controller';

const router = Router();

router.get('/:tenantId', authenticate, tenantController.getTenant.bind(tenantController));
router.patch('/:tenantId', authenticate, tenantController.updateTenant.bind(tenantController));

export default router;
