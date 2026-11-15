
import { Router } from 'express';
import { VoiceController } from '../controllers/voice.controller.js';
import { audioUpload } from '../middleware/upload.js';

const router = Router();

// GET: Check Gnani STT and TTS service status
router.get('/status', VoiceController.getStatus);

// POST: Convert text into speech using Gnani Timbre
router.post('/synthesize', VoiceController.synthesize);

// POST: Convert uploaded audio into text using Gnani Prisma
router.post(
  '/transcribe',
  audioUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'audio_file', maxCount: 1 }
  ]),
  (req, res, next) => {
    req.file =
      req.files?.audio?.[0] ||
      req.files?.audio_file?.[0] ||
      null;

    VoiceController.transcribe(req, res, next);
  }
);

export default router;
