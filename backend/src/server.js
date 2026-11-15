import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to THIS file, not process.cwd()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
// Uses the absolute path relative to server.js so it works regardless of
// which directory the process was started from (project root, backend/, etc.)
const envPath = path.resolve(__dirname, '..', '.env');
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  console.warn(`⚠️  Could not load .env from ${envPath}: ${dotenvResult.error.message}`);
  console.warn('   Falling back to process environment variables.');
} else {
  console.log(`✅ Loaded environment from ${envPath}`);
}

import { connectDatabase } from './config/database.js';
import healthRoutes from './routes/health.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import chatRoutes from './routes/chat.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import { VoiceController } from './controllers/voice.controller.js';
import { audioUpload } from './middleware/upload.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/API testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Vaani AI API',
    tagline: 'Your Voice. Your Language. Your AI.',
    status: 'online',
    version: '1.0.0',
    documentation: 'https://docs.gnani.ai/',
    endpoints: {
      health: 'GET /api/health',
      voiceStatus: 'GET /api/voice/status',
      transcribe: 'POST /api/voice/transcribe',
      synthesize: 'POST /api/voice/synthesize',
      chat: 'POST /api/ai/chat',
      conversationPipeline: 'POST /api/assistant/conversation',
      conversations: 'GET /api/conversations'
    }
  });
});

// Health check
app.use('/api', healthRoutes);

// Voice services (Gnani Prisma STT & Timbre TTS)
app.use('/api/voice', voiceRoutes);

// AI Reasoning services
app.use('/api/ai', chatRoutes);

// Conversation management
app.use('/api/conversations', conversationRoutes);

// Full assistant conversation pipeline (audio in -> stt -> reasoning -> tts -> audio out)
app.post(
  '/api/assistant/conversation',
  audioUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'audio_file', maxCount: 1 }
  ]),
  (req, res, next) => {
    req.file = req.files?.audio?.[0] || req.files?.audio_file?.[0] || req.file;
    VoiceController.fullPipeline(req, res, next);
  }
);

// 404 Handler
app.use(notFoundHandler);

// Central Error Handler
app.use(errorHandler);

// Initialize database and start server
export const startServer = async () => {
  await connectDatabase();

  // Log API key status at startup so issues are immediately visible
  const gnaniKey = process.env.GNANI_API_KEY;
  const gnaniConfigured = gnaniKey && gnaniKey.trim() !== '' && gnaniKey !== 'your_gnani_api_key_here';

  return new Promise((resolve) => {
    const serverInstance = app.listen(PORT, () => {
      console.log(`
🎙️  ================================================
    VAANI AI BACKEND RUNNING
    Port: ${PORT}
    URL:  http://localhost:${PORT}
    Health: http://localhost:${PORT}/api/health
    Docs: https://docs.gnani.ai/

    GNANI_API_KEY: ${gnaniConfigured ? '✅ Configured (key loaded)' : '❌ NOT SET — STT/TTS will fail'}
    AI Provider:   ${process.env.AI_PROVIDER || 'local_intelligent'}
====================================================
      `);
      resolve(serverInstance);
    });
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
