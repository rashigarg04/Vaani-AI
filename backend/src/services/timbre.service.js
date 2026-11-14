import axios from 'axios';
import { normalizeLanguageCode, SUPPORTED_VOICES } from '../utils/validators.js';

export class TimbreService {
  /**
   * Synthesize text into speech audio buffer using Gnani Timbre REST API
   * Official Endpoint: POST https://api.vachana.ai/api/v1/tts/inference
   * Header: X-API-Key-ID: <GNANI_API_KEY>
   * Response: Binary audio/wav data
   */
  static async synthesizeSpeech({
    text,
    voice = 'Shivani',
    language = 'indic-auto',
    speed = 1.0,
    sampleRate = 24000
  }) {
    const apiKey = process.env.GNANI_API_KEY;
    const baseUrl = process.env.GNANI_BASE_URL || 'https://api.vachana.ai';
    const model = process.env.GNANI_TIMBRE_MODEL || 'timbre-v3.0';

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gnani_api_key_here') {
      const err = new Error('Gnani API Key is not configured. Please set GNANI_API_KEY in your backend/.env file to enable live Text-to-Speech synthesis.');
      err.status = 401;
      err.code = 'GNANI_API_KEY_MISSING';
      throw err;
    }

    if (!text || text.trim() === '') {
      const err = new Error('Text to synthesize cannot be empty.');
      err.status = 400;
      err.code = 'EMPTY_TEXT';
      throw err;
    }

    // Default voice if invalid
    const selectedVoice = SUPPORTED_VOICES.find(v => v.toLowerCase() === voice.toLowerCase()) || 'Shivani';

    const normalizedLang = normalizeLanguageCode(language);
    // For Timbre, if indic-auto or hinglish is passed, standard hi-IN or en-IN handles code-mix
    const ttsLang = normalizedLang === 'indic-auto' || normalizedLang.includes(',') ? 'hi-IN' : normalizedLang;

    const payload = {
      text: text.trim(),
      voice: selectedVoice,
      model,
      language: ttsLang,
      speed: Number(speed) || 1.0,
      audio_config: {
        sample_rate: sampleRate,
        num_channels: 1,
        sample_width: 2,
        encoding: 'linear_pcm',
        container: 'wav'
      }
    };

    const endpointUrl = `${baseUrl.replace(/\/+$/, '')}/api/v1/tts/inference`;

    try {
      const response = await axios.post(endpointUrl, payload, {
        headers: {
          'X-API-Key-ID': apiKey.trim(),
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer', // Important: binary audio response
        timeout: 30000
      });

      const audioBuffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'] || 'audio/wav';

      return {
        success: true,
        audioBuffer,
        contentType,
        voice: selectedVoice,
        model,
        language: ttsLang,
        sizeBytes: audioBuffer.length
      };
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        let errMsg = 'Unknown Gnani Timbre error';

        try {
          // If error returned as JSON in arraybuffer
          if (error.response.data && Buffer.isBuffer(error.response.data)) {
            const parsed = JSON.parse(error.response.data.toString('utf-8'));
            errMsg = parsed.message || parsed.detail?.message || JSON.stringify(parsed);
          } else if (typeof error.response.data === 'object') {
            errMsg = error.response.data.message || JSON.stringify(error.response.data);
          }
        } catch {
          errMsg = error.message;
        }

        console.error(`[Gnani Timbre TTS Error ${status}]:`, errMsg);

        const customError = new Error(
          status === 401 || status === 403
            ? 'Gnani API authentication failed for TTS. Please verify your GNANI_API_KEY.'
            : status === 429
            ? 'Gnani API rate limit exceeded for TTS. Wait a moment and retry.'
            : `Gnani TTS error: ${errMsg}`
        );
        customError.status = status;
        throw customError;
      }

      if (error.code === 'ECONNABORTED') {
        const timeoutError = new Error('Gnani TTS API request timed out after 30 seconds.');
        timeoutError.status = 504;
        throw timeoutError;
      }

      throw error;
    }
  }

  /**
   * Check Gnani Timbre service configuration status
   */
  static getStatus() {
    const apiKey = process.env.GNANI_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gnani_api_key_here');
    return {
      configured: isConfigured,
      service: 'Gnani Timbre v3.0 (TTS)',
      endpoint: `${(process.env.GNANI_BASE_URL || 'https://api.vachana.ai').replace(/\/+$/, '')}/api/v1/tts/inference`,
      model: process.env.GNANI_TIMBRE_MODEL || 'timbre-v3.0',
      availableVoices: SUPPORTED_VOICES
    };
  }
}
