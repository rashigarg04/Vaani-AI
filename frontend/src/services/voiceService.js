
import api from './api.js';

// Detect the actual audio format
const getAudioFileName = (audioBlob) => {
  const mimeType = (audioBlob.type || 'audio/webm').toLowerCase();

  if (mimeType.includes('webm')) return 'recording.webm';
  if (mimeType.includes('ogg')) return 'recording.ogg';
  if (mimeType.includes('wav')) return 'recording.wav';
  if (mimeType.includes('flac')) return 'recording.flac';
  if (mimeType.includes('mp4')) return 'recording.m4a';
  if (mimeType.includes('aac')) return 'recording.aac';
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) {
    return 'recording.mp3';
  }

  return 'recording.webm';
};

export const voiceService = {
  /**
   * Fetch voice service status
   */
  async getStatus() {
    try {
      const response = await api.get('/voice/status');
      return response.data;
    } catch (error) {
      console.error('Voice status error:', error);
      throw error;
    }
  },

  /**
   * Transcribe recorded audio using Gnani Prisma STT
   */
  async transcribeAudio(audioBlob, language = 'indic-auto') {
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('No audio recorded. Please try again.');
    }

    const formData = new FormData();

    formData.append(
      'audio_file',
      audioBlob,
      getAudioFileName(audioBlob)
    );

    formData.append('language', language);
    formData.append('format', 'codemix');

    try {
      const response = await api.post(
        '/voice/transcribe',
        formData,
        {
          timeout: 45000,
        }
      );

      return response.data;

    } catch (error) {
      console.error('========== GNANI STT ERROR ==========');
      console.error('Status:', error.status || error.original?.response?.status);
      console.error('Response:', error.original?.response?.data);
      console.error('URL:', error.original?.config?.url);
      console.error('Message:', error.message);
      console.error('=====================================');

      throw error;
    }
  },

  /**
   * Synthesize text to speech using Gnani Timbre TTS
   */
  async synthesizeSpeech({
    text,
    voice = 'Shivani',
    language = 'indic-auto',
    speed = 1.0,
  }) {
    if (!text || !text.trim()) {
      throw new Error('Please enter text to preview the voice.');
    }

    try {
      const response = await api.post(
        '/voice/synthesize',
        {
          text,
          voice,
          language,
          speed,
        },
        {
          responseType: 'blob',
          timeout: 45000,
        }
      );

      const audioBlob = response.data;

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Voice API returned an empty audio response.');
      }

      if (audioBlob.type?.includes('application/json')) {
        const errorText = await audioBlob.text();
        throw new Error(errorText || 'Voice synthesis failed.');
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        blob: audioBlob,
        sizeBytes: audioBlob.size,
      };

    } catch (error) {
      console.error('Voice synthesis error:', error);
      throw error;
    }
  },

  /**
   * Execute full conversational pipeline
   */
  async runPipeline({
    audioBlob,
    text,
    language = 'indic-auto',
    conversationId,
    voice = 'Shivani',
  }) {
    const formData = new FormData();

    if (audioBlob && audioBlob.size > 0) {
      formData.append(
        'audio_file',
        audioBlob,
        getAudioFileName(audioBlob)
      );
    }

    if (text) {
      formData.append('text', text);
    }

    formData.append('language', language);

    if (conversationId) {
      formData.append('conversationId', conversationId);
    }

    formData.append('voice', voice);

    try {
      const response = await api.post(
        '/assistant/conversation',
        formData,
        {
          timeout: 45000,
        }
      );

      return response.data;

    } catch (error) {
      console.error('Conversation pipeline error:', error);
      throw error;
    }
  },
};

export default voiceService;
