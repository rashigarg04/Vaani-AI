import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';

const router = Router();

// POST /api/ai/chat
router.post('/chat', ChatController.chat);

// GET /api/ai/provider
router.get('/provider', ChatController.getProvider);

export default router;
