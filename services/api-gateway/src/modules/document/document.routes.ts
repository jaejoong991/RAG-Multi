import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { validate } from '../../middleware/validateRequest'
import { documentController } from './document.controller'
import { createDocumentSchema, updateStatusSchema } from './document.schema'

const router = Router()

router.get('/', authenticate, documentController.listDocuments.bind(documentController))
router.post('/', authenticate, validate(createDocumentSchema), documentController.createDocument.bind(documentController))
router.get('/:id', authenticate, documentController.getDocument.bind(documentController))
router.patch('/:id/status', authenticate, validate(updateStatusSchema), documentController.updateDocumentStatus.bind(documentController))
router.delete('/:id', authenticate, documentController.deleteDocument.bind(documentController))

export default router
