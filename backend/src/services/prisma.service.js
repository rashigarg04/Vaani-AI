
import axios from 'axios';
import FormData from 'form-data';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import { normalizeLanguageCode } from '../utils/validators.js';

export class PrismaService {

  /**
   * Convert WebM/Opus audio into valid WAV audio using FFmpeg.
   * Output: PCM signed 16-bit, 16 kHz, mono.
   */
  static async convertToWav(audioBuffer) {
    if (!ffmpegPath) {
      throw new Error('FFmpeg binary not found. Check ffmpeg-static installation.');
    }

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn(ffmpegPath, [
        '-hide_banner',
        '-loglevel', 'error',
        '-i', 'pipe:0',
        '-vn',
        '-ac', '1',
        '-ar', '16000',
        '-c:a', 'pcm_s16le',
        '-f', 'wav',
        'pipe:1',
      ]);

      const outputChunks = [];
      let errorOutput = '';

      ffmpeg.stdout.on('data', (chunk) => {
        outputChunks.push(chunk);
      });

      ffmpeg.stderr.on('data', (chunk) => {
        errorOutput += chunk.toString();
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`Unable to start FFmpeg: ${error.message}`));
      });

      ffmpeg.on('close', (code) => {
        if (code !== 0) {
          reject(
            new Error(
              `Audio conversion failed: ${errorOutput || `FFmpeg exited with code ${code}`}`
            )
          );
          return;
        }

        const wavBuffer = Buffer.concat(outputChunks);

        if (wavBuffer.length === 0) {
          reject(new Error('FFmpeg produced an empty WAV file.'));
          return;
        }

        resolve(wavBuffer);
      });

      ffmpeg.stdin.on('error', (error) => {
        reject(new Error(`FFmpeg input error: ${error.message}`));
      });

      ffmpeg.stdin.end(audioBuffer);
    });
  }

  /**
   * Transcribe audio using Gnani Prisma STT REST API.
   */
  static async transcribeAudio({
    audioBuffer,
    fileName = 'recording.wav',
    mimeType = 'audio/wav',
    languageCode = 'indic-auto',
    format = 'codemix',
  }) {
    const apiKey = process.env.GNANI_API_KEY?.trim();

    const baseUrl = (
      process.env.GNANI_BASE_URL || 'https://api.vachana.ai'
    ).replace(/\/+$/, '');

    const model =
      process.env.GNANI_PRISMA_MODEL || 'prisma-v3.0';

    if (
      !apiKey ||
      apiKey === 'your_gnani_api_key_here'
    ) {
      const error = new Error(
        'Gnani API Key is not configured. Set GNANI_API_KEY in backend/.env.'
      );
      error.status = 401;
      error.code = 'GNANI_API_KEY_MISSING';
      throw error;
    }

    if (!Buffer.isBuffer(audioBuffer) || audioBuffer.length === 0) {
      const error = new Error(
        'Empty audio recording received. Please record speech before sending.'
      );
      error.status = 400;
      error.code = 'EMPTY_AUDIO';
      throw error;
    }

    const startTime = Date.now();

    // Convert WebM/Opus into a real WAV file.
    const isWebM =
      mimeType.toLowerCase().includes('webm') ||
      mimeType.toLowerCase().includes('opus') ||
      fileName.toLowerCase().endsWith('.webm');

    let finalAudioBuffer = audioBuffer;
    let finalFileName = fileName;
    let finalMimeType = mimeType;

    if (isWebM) {
      console.log('[Gnani STT] Converting WebM audio to WAV...');

      try {
        finalAudioBuffer = await this.convertToWav(audioBuffer);
        finalFileName = 'recording.wav';
        finalMimeType = 'audio/wav';

        console.log(
          `[Gnani STT] Audio converted successfully: ${finalAudioBuffer.length} bytes`
        );
      } catch (conversionError) {
        const error = new Error(
          `WebM to WAV conversion failed: ${conversionError.message}`
        );
        error.status = 422;
        error.code = 'AUDIO_CONVERSION_FAILED';
        throw error;
      }
    }

    const normalizedLang = normalizeLanguageCode(languageCode);

    const formData = new FormData();

    formData.append('audio_file', finalAudioBuffer, {
      filename: finalFileName,
      contentType: finalMimeType,
      knownLength: finalAudioBuffer.length,
    });

    formData.append('model', model);
    formData.append('language_code', normalizedLang);
    formData.append('format', format);

    const endpointUrl = `${baseUrl}/stt/v3`;

    try {
      const response = await axios.post(endpointUrl, formData, {
        headers: {
          'X-API-Key-ID': apiKey,
          ...formData.getHeaders(),
        },
        timeout: 45000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const responseTime = (Date.now() - startTime) / 1000;
      const data = response.data || {};

      const transcript = data.transcript || data.text || '';

      return {
        success: true,
        transcript: transcript.trim(),
        model: data.model || model,
        detected_language_code:
          data.detected_language_code || normalizedLang,
        request_id: data.request_id || null,
        processing_time: data.processing_time || responseTime,
        end_to_end_latency:
          data.end_to_end_latency || responseTime,
      };

    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        const message =
          responseData?.message ||
          responseData?.detail?.message ||
          JSON.stringify(responseData);

        console.error(
          `[Gnani Prisma STT Error ${status}]:`,
          message
        );

        const customError = new Error(
          status === 401 || status === 403
            ? 'Gnani API authentication failed. Verify GNANI_API_KEY.'
            : status === 429
              ? 'Gnani API quota/rate limit exceeded. Please try again later.'
              : `Gnani STT error: ${message}`
        );

        customError.status = status;
        customError.upstream = responseData;

        throw customError;
      }

      if (error.code === 'ECONNABORTED') {
        const timeoutError = new Error(
          'Gnani STT API request timed out after 45 seconds.'
        );

        timeoutError.status = 504;
        throw timeoutError;
      }

      throw error;
    }
  }

  /**
   * Check Gnani service configuration status.
   */
  static getStatus() {
    const apiKey = process.env.GNANI_API_KEY?.trim();

    const isConfigured = Boolean(
      apiKey && apiKey !== 'your_gnani_api_key_here'
    );

    const baseUrl = (
      process.env.GNANI_BASE_URL || 'https://api.vachana.ai'
    ).replace(/\/+$/, '');

    return {
      configured: isConfigured,
      service: 'Gnani Prisma v3.0 (STT)',
      endpoint: `${baseUrl}/stt/v3`,
      model: process.env.GNANI_PRISMA_MODEL || 'prisma-v3.0',
      audioConversion: 'WebM to WAV using FFmpeg',
    };
  }
}
