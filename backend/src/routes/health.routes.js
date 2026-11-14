import { Router } from 'express';
import { getDbStatus } from '../config/database.js';
import { PrismaService } from '../services/prisma.service.js';
import { TimbreService } from '../services/timbre.service.js';
import { AiService } from '../services/ai.service.js';

const router = Router();

router.get('/health', (req, res) => {
  const dbStatus = getDbStatus();
  const prismaStatus = PrismaService.getStatus();
  const timbreStatus = TimbreService.getStatus();
  const aiProvider = AiService.getActiveProvider();

  res.status(200).json({
    status: 'healthy',
    application: 'Vaani AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbStatus,
      gnaniPrisma: prismaStatus,
      gnaniTimbre: timbreStatus,
      aiReasoning: aiProvider
    }
  });
});

export default router;
