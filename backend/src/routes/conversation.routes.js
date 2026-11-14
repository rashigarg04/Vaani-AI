import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller.js';

const router = Router();

// GET /api/conversations
router.get('/', ConversationController.list);

// GET /api/conversations/:id
router.get('/:id', ConversationController.getById);

// DELETE /api/conversations/:id
router.delete('/:id', ConversationController.deleteOne);

// DELETE /api/conversations
router.delete('/', ConversationController.clearAll);

export default router;
