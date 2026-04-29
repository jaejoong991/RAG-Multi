import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { llmConfigController } from './llm-config.controller';

const router = Router();

router.get('/', authenticate, llmConfigController.getConfig.bind(llmConfigController));
router.patch('/', authenticate, llmConfigController.updateConfig.bind(llmConfigController));
router.get('/internal/:tenantId', llmConfigController.getConfigInternal.bind(llmConfigController));

export default router;
