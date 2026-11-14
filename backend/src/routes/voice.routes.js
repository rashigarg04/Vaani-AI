import { Router } from 'express';
import { VoiceController } from '../controllers/voice.controller.js';
import { audioUpload } from '../middleware/upload.js';

const router = Router();

// GET /api/voice/status
router.get('/status', VoiceController.getStatus);

// POST /api/voice/transcribe (accepts file under 'audio' or 'audio_file')
router.post(
  '/transcribe',
  audioUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'audio_file', maxCount: 1 }
  ]),
  (req, res, next) => {
    // Map either field to req.file
    req.file = req.files?.audio?.[0] || req.files?.audio_file?.[0] || req.file;
    VoiceController.transcribe(req, res, next);
  }
);

// POST /api/voice/synthesize
router.post('/synthesize', VoiceController.synthesize);

export default router;
