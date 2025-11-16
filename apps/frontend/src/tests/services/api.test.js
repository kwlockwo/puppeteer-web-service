import { describe, test, expect, beforeEach, vi } from 'vitest';
import api from '../../services/api';

describe('API Service', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('screenshot', () => {
    test('should call screenshot endpoint with correct params', async () => {
      const mockResponse = { success: true, screenshot: 'base64data' };
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await api.screenshot('https://example.com', true);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/screenshot',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'https://example.com', fullPage: true })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('generatePDF', () => {
    test('should call PDF generation endpoint', async () => {
      const mockResponse = { success: true, pdf: 'base64pdf' };
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await api.generatePDF('https://example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/generate-pdf',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ url: 'https://example.com' })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('scrapeData', () => {
    test('should call scrape endpoint', async () => {
      const mockResponse = { success: true, data: { title: 'Test' } };
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await api.scrapeData('https://example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/scrape',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ url: 'https://example.com' })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPageInfo', () => {
    test('should call page info endpoint', async () => {
      const mockResponse = { success: true, info: { title: 'Test Page' } };
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await api.getPageInfo('https://example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/page-info',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ url: 'https://example.com' })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('extractText', () => {
    test('should call extract text endpoint', async () => {
      const mockResponse = { success: true, text: 'Extracted text' };
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      const result = await api.extractText('https://example.com', 'h1');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/extract-text',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ url: 'https://example.com', selector: 'h1' })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    test('should throw error when fetch fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.screenshot('https://example.com')).rejects.toThrow('Network error');
    });
  });
});
