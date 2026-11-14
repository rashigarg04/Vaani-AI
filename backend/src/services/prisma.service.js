import axios from 'axios';
import FormData from 'form-data';
import { normalizeLanguageCode } from '../utils/validators.js';

export class PrismaService {
  /**
   * Transcribe audio buffer using Gnani Prisma STT REST API
   * Official Endpoint: POST https://api.vachana.ai/stt/v3
   * Header: X-API-Key-ID: <GNANI_API_KEY>
   */
  static async transcribeAudio({
    audioBuffer,
    fileName = 'recording.wav',
    mimeType = 'audio/wav',
    languageCode = 'indic-auto',
    format = 'codemix'
  }) {
    const apiKey = process.env.GNANI_API_KEY;
    const baseUrl = process.env.GNANI_BASE_URL || 'https://api.vachana.ai';
    const model = process.env.GNANI_PRISMA_MODEL || 'prisma-v3.0';

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gnani_api_key_here') {
      const err = new Error('Gnani API Key is not configured. Please set GNANI_API_KEY in your backend/.env file to enable live Speech-to-Text transcription.');
      err.status = 401;
      err.code = 'GNANI_API_KEY_MISSING';
      throw err;
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      const err = new Error('Empty audio recording received. Please record speech before sending.');
      err.status = 400;
      err.code = 'EMPTY_AUDIO';
      throw err;
    }

    const normalizedLang = normalizeLanguageCode(languageCode);

    // Build multipart/form-data payload as per official docs
    const formData = new FormData();
    formData.append('audio_file', audioBuffer, {
      filename: fileName,
      contentType: mimeType
    });
    formData.append('model', model);
    formData.append('language_code', normalizedLang);
    formData.append('format', format);

    const endpointUrl = `${baseUrl.replace(/\/+$/, '')}/stt/v3`;

    const startTime = Date.now();
    try {
      const response = await axios.post(endpointUrl, formData, {
        headers: {
          'X-API-Key-ID': apiKey.trim(),
          ...formData.getHeaders()
        },
        timeout: 30000, // 30s timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const responseTime = (Date.now() - startTime) / 1000;
      const data = response.data;

      // Extract transcript according to official Gnani response format
      const transcript = data.transcript || data.text || '';
      const detectedLang = data.detected_language_code || normalizedLang;

      return {
        success: true,
        transcript: transcript.trim(),
        model: data.model || model,
        detected_language_code: detectedLang,
        request_id: data.request_id || null,
        processing_time: data.processing_time || responseTime,
        end_to_end_latency: data.end_to_end_latency || responseTime
      };
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message || error.response.data?.detail?.message || JSON.stringify(error.response.data);
        console.error(`[Gnani Prisma STT Error ${status}]:`, msg);

        const customError = new Error(
          status === 401 || status === 403
            ? 'Gnani API authentication failed. Please verify your GNANI_API_KEY.'
            : status === 429
            ? 'Gnani API quota/rate limit exceeded. Please wait a moment and try again.'
            : `Gnani STT error: ${msg}`
        );
        customError.status = status;
        customError.upstream = error.response.data;
        throw customError;
      }

      if (error.code === 'ECONNABORTED') {
        const timeoutError = new Error('Gnani STT API request timed out after 30 seconds.');
        timeoutError.status = 504;
        throw timeoutError;
      }

      throw error;
    }
  }

  /**
   * Check Gnani service configuration status
   */
  static getStatus() {
    const apiKey = process.env.GNANI_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gnani_api_key_here');
    return {
      configured: isConfigured,
      service: 'Gnani Prisma v3.0 (STT)',
      endpoint: `${(process.env.GNANI_BASE_URL || 'https://api.vachana.ai').replace(/\/+$/, '')}/stt/v3`,
      model: process.env.GNANI_PRISMA_MODEL || 'prisma-v3.0'
    };
  }
}
