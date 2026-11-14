import api from './api.js';

export const voiceService = {
  /**
   * Fetch backend voice & Gnani AI configuration status
   */
  async getStatus() {
    const response = await api.get('/voice/status');
    return response.data;
  },

  /**
   * Transcribe recorded audio with Gnani Prisma STT
   * @param {Blob|File} audioBlob
   * @param {string} language
   */
  async transcribeAudio(audioBlob, language = 'indic-auto') {
    const formData = new FormData();
    const fileName = audioBlob.type?.includes('webm') ? 'recording.webm' : 'recording.wav';
    formData.append('audio_file', audioBlob, fileName);
    formData.append('language', language);
    formData.append('format', 'codemix');

    const response = await api.post('/voice/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 35000,
    });

    return response.data;
  },

  /**
   * Synthesize text to speech with Gnani Timbre TTS
   * Returns a local object URL (blob:...) that can be played in any browser Audio element
   * @param {string} text
   * @param {string} voice
   * @param {string} language
   * @param {number} speed
   */
  async synthesizeSpeech({ text, voice = 'Shivani', language = 'indic-auto', speed = 1.0 }) {
    const response = await api.post(
      '/voice/synthesize',
      { text, voice, language, speed },
      {
        responseType: 'blob', // Get raw audio/wav binary
        timeout: 35000,
      }
    );

    // Create an object URL from the audio blob
    const audioBlob = new Blob([response.data], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      audioUrl,
      blob: audioBlob,
      sizeBytes: audioBlob.size,
    };
  },

  /**
   * Execute full conversational pipeline in one call
   */
  async runPipeline({ audioBlob, text, language = 'indic-auto', conversationId, voice = 'Shivani' }) {
    const formData = new FormData();
    if (audioBlob) {
      const fileName = audioBlob.type?.includes('webm') ? 'recording.webm' : 'recording.wav';
      formData.append('audio_file', audioBlob, fileName);
    }
    if (text) {
      formData.append('text', text);
    }
    formData.append('language', language);
    if (conversationId) formData.append('conversationId', conversationId);
    formData.append('voice', voice);

    const response = await api.post('/assistant/conversation', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 45000,
    });

    return response.data;
  }
};
