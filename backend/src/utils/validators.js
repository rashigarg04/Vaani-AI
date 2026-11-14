// Supported languages and models per Gnani documentation
export const SUPPORTED_LANGUAGES = [
  'indic-auto', // Auto-detection
  'hi-IN',      // Hindi
  'en-IN',      // English (India)
  'hi-IN,en-IN',// Code-mixed Hinglish
  'ta-IN',      // Tamil
  'te-IN',      // Telugu
  'kn-IN',      // Kannada
  'ml-IN',      // Malayalam
  'mr-IN',      // Marathi
  'pa-IN',      // Punjabi
  'bn-IN',      // Bengali
  'gu-IN'       // Gujarati
];

export const SUPPORTED_VOICES = [
  'Shivani',  // Default feminine
  'Lakshmi',
  'Kalpana',
  'Chetana',
  'Vasudha',
  'Riyaa',
  'Tarika',
  'Avinash',  // Masculine
  'Shubham',
  'Prakash',
  'Devansh',
  'Yashraj'
];

export const SUPPORTED_AUDIO_MIMES = [
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/webm',
  'audio/ogg',
  'audio/mp3',
  'audio/mpeg',
  'audio/m4a',
  'audio/mp4',
  'audio/aac',
  'audio/flac'
];

export const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024; // 15MB limit

export const isValidLanguage = (lang) => {
  if (!lang) return false;
  return SUPPORTED_LANGUAGES.includes(lang) || lang === 'hinglish' || lang === 'hindi' || lang === 'english';
};

export const normalizeLanguageCode = (lang) => {
  if (!lang) return 'indic-auto';
  const lower = lang.toLowerCase();
  if (lower === 'hindi' || lower === 'hi') return 'hi-IN';
  if (lower === 'english' || lower === 'en') return 'en-IN';
  if (lower === 'hinglish' || lower === 'hi-en') return 'hi-IN,en-IN';
  return lang;
};

export const isValidVoice = (voice) => {
  if (!voice) return false;
  return SUPPORTED_VOICES.map(v => v.toLowerCase()).includes(voice.toLowerCase());
};
