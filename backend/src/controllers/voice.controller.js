import { PrismaService } from '../services/prisma.service.js';
import { TimbreService } from '../services/timbre.service.js';
import { AiService } from '../services/ai.service.js';
import { ConversationService } from '../services/conversation.service.js';

export class VoiceController {
  /**
   * POST /api/voice/transcribe
   * Transcribe recorded audio with Gnani Prisma
   */
  static async transcribe(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_AUDIO_FILE',
          message: 'No audio file provided in request. Please send multipart/form-data with "audio" or "audio_file" field.'
        });
      }

      const { language = 'indic-auto', format = 'codemix' } = req.body;

      const result = await PrismaService.transcribeAudio({
        audioBuffer: req.file.buffer,
        fileName: req.file.originalname || 'recording.wav',
        mimeType: req.file.mimetype || 'audio/wav',
        languageCode: language,
        format
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/voice/synthesize
   * Convert text into spoken speech with Gnani Timbre
   */
  static async synthesize(req, res, next) {
    try {
      const { text, voice = 'Shivani', language = 'indic-auto', speed = 1.0, format = 'binary' } = req.body;

      if (!text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'EMPTY_TEXT',
          message: 'Text is required for voice synthesis.'
        });
      }

      const result = await TimbreService.synthesizeSpeech({
        text,
        voice,
        language,
        speed
      });

      if (format === 'base64') {
        const base64Audio = result.audioBuffer.toString('base64');
        return res.status(200).json({
          success: true,
          audioData: `data:audio/wav;base64,${base64Audio}`,
          voice: result.voice,
          model: result.model,
          sizeBytes: result.sizeBytes
        });
      }

      // Default: binary audio stream
      res.set({
        'Content-Type': result.contentType || 'audio/wav',
        'Content-Length': result.audioBuffer.length,
        'Cache-Control': 'no-cache',
        'X-Gnani-Voice': result.voice,
        'X-Gnani-Model': result.model
      });

      return res.send(result.audioBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/voice/status
   * Status of speech services
   */
  static getStatus(req, res) {
    const prisma = PrismaService.getStatus();
    const timbre = TimbreService.getStatus();
    const overallReady = prisma.configured && timbre.configured;

    return res.status(200).json({
      success: true,
      ready: overallReady,
      prisma,
      timbre,
      environment: process.env.NODE_ENV || 'development'
    });
  }

  /**
   * POST /api/assistant/conversation
   * End-to-end voice pipeline: Speech in -> STT -> Reasoning -> TTS -> Speech out
   */
  static async fullPipeline(req, res, next) {
    try {
      let userText = req.body.text;
      let language = req.body.language || 'indic-auto';
      const conversationId = req.body.conversationId || `conv-${Date.now()}`;
      const voice = req.body.voice || 'Shivani';

      let sttMetadata = null;

      // 1. If audio file was uploaded, transcribe via Gnani Prisma
      if (req.file) {
        const sttResult = await PrismaService.transcribeAudio({
          audioBuffer: req.file.buffer,
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          languageCode: language
        });

        userText = sttResult.transcript;
        if (sttResult.detected_language_code) {
          language = sttResult.detected_language_code;
        }
        sttMetadata = {
          model: sttResult.model,
          latency: sttResult.end_to_end_latency,
          detectedLanguage: sttResult.detected_language_code
        };
      }

      if (!userText || userText.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'NO_SPEECH_OR_TEXT',
          message: 'Could not transcribe any speech or no text was provided.'
        });
      }

      // 2. Save user message to conversation history
      await ConversationService.addMessage(conversationId, {
        sender: 'user',
        text: userText,
        language,
        metadata: sttMetadata || {}
      });

      // 3. Fetch past conversation context for reasoning
      const conversation = await ConversationService.getConversation(conversationId);
      const history = conversation?.messages || [];

      // 4. Generate AI response using configured reasoning engine
      const aiResult = await AiService.generateResponse({
        prompt: userText,
        language,
        conversationHistory: history,
        preferredLanguage: language
      });

      // 5. Synthesize speech using Gnani Timbre
      let audioBase64 = null;
      let ttsError = null;
      try {
        const ttsResult = await TimbreService.synthesizeSpeech({
          text: aiResult.text,
          voice,
          language
        });
        audioBase64 = `data:audio/wav;base64,${ttsResult.audioBuffer.toString('base64')}`;
      } catch (err) {
        console.warn('TTS Synthesis warning:', err.message);
        ttsError = err.message;
      }

      // 6. Save assistant message to conversation history
      const assistantMessage = await ConversationService.addMessage(conversationId, {
        sender: 'assistant',
        text: aiResult.text,
        language: aiResult.language,
        audioUrl: audioBase64,
        metadata: {
          provider: aiResult.provider,
          latency: aiResult.latency,
          ttsVoice: voice,
          ttsError: ttsError || null
        }
      });

      return res.status(200).json({
        success: true,
        conversationId,
        userQuery: userText,
        aiResponse: aiResult.text,
        audioUrl: audioBase64,
        provider: aiResult.provider,
        latency: aiResult.latency,
        detectedLanguage: language,
        message: assistantMessage
      });
    } catch (error) {
      next(error);
    }
  }
}
