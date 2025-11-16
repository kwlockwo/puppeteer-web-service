// Shared constants between frontend and backend

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  SCREENSHOT: '/api/screenshot',
  GENERATE_PDF: '/api/generate-pdf',
  SCRAPE: '/api/scrape',
  PAGE_INFO: '/api/page-info',
  EXTRACT_TEXT: '/api/extract-text'
};

export const DEFAULT_TIMEOUT = 30000;

export const VIEWPORT_SIZES = {
  DESKTOP: { width: 1920, height: 1080 },
  LAPTOP: { width: 1366, height: 768 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 }
};

export const PDF_FORMATS = {
  A4: 'A4',
  LETTER: 'Letter',
  LEGAL: 'Legal',
  TABLOID: 'Tabloid'
};

export const IMAGE_TYPES = {
  PNG: 'png',
  JPEG: 'jpeg',
  WEBP: 'webp'
};
