import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { analyticsController } from './analytics.controller'

const router = Router()

router.get('/', authenticate, analyticsController.getSummary.bind(analyticsController))
router.get('/daily', authenticate, analyticsController.getDailyUsage.bind(analyticsController))

export default router
