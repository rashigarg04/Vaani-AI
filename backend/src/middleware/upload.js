import multer from 'multer';
import { MAX_AUDIO_SIZE_BYTES, SUPPORTED_AUDIO_MIMES } from '../utils/validators.js';

// Memory storage keeps audio in buffer, avoiding lingering files on disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check MIME type or common audio extensions
  const mime = file.mimetype.toLowerCase();
  const name = file.originalname.toLowerCase();

  const isSupportedMime = SUPPORTED_AUDIO_MIMES.some(m => mime.includes(m.split('/')[1]));
  const isSupportedExt = /\.(wav|webm|ogg|mp3|m4a|aac|flac)$/i.test(name);

  if (isSupportedMime || isSupportedExt || mime.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported audio format: ${file.mimetype}. Please upload WAV, WebM, MP3, OGG, M4A, or FLAC.`), false);
  }
};

export const audioUpload = multer({
  storage,
  limits: {
    fileSize: MAX_AUDIO_SIZE_BYTES, // 15MB limit
  },
  fileFilter
});
