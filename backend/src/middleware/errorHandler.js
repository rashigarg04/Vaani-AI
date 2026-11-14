import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${req.method} ${req.url}:`, err.message || err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'FILE_TOO_LARGE',
        message: 'Audio file exceeds the maximum 15MB size limit.'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.code,
      message: `File upload error: ${err.message}`
    });
  }

  // File filter validation errors
  if (err.message && err.message.includes('Unsupported audio format')) {
    return res.status(400).json({
      success: false,
      error: 'UNSUPPORTED_AUDIO_FORMAT',
      message: err.message
    });
  }

  // Axios/Upstream API errors
  if (err.isAxiosError) {
    const status = err.response?.status || 502;
    const upstreamData = err.response?.data;
    const message = upstreamData?.message || upstreamData?.detail?.message || err.message;

    return res.status(status).json({
      success: false,
      error: 'UPSTREAM_API_ERROR',
      status_code: status,
      message: message || 'Failed to communicate with external AI service.'
    });
  }

  // Standard server error
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected internal error occurred. Please try again.'
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
};
