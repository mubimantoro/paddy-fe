const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://18.142.57.164:3000',
  environment: import.meta.env.VITE_ENV || 'development',
  maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE, 10) || 5 * 1024 * 1024,
  maxDocumentSize: parseInt(import.meta.env.VITE_MAX_DOCUMENT_SIZE, 10) || 10 * 1024 * 1024,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required config
if (!config.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export default config;