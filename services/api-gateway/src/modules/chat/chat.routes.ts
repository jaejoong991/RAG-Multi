import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { validate } from '../../middleware/validateRequest'
import { chatController } from './chat.controller'
import { createConversationSchema, querySchema } from './chat.schema'

const router = Router()

router.get('/', authenticate, chatController.listConversations.bind(chatController))
router.post(
  '/',
  authenticate,
  validate(createConversationSchema),
  chatController.createConversation.bind(chatController),
)
router.post(
  '/query',
  authenticate,
  validate(querySchema),
  chatController.query.bind(chatController),
)
router.get('/:id', authenticate, chatController.getConversation.bind(chatController))
router.delete('/:id', authenticate, chatController.deleteConversation.bind(chatController))

export default router
