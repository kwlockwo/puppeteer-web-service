import type { APIResponse, ScreenshotResponse, PDFResponse, ScrapeResponse, PageInfoResponse } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  async callEndpoint<T extends APIResponse>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json() as T;
    return data;
  },

  async screenshot(url: string, fullPage = true): Promise<ScreenshotResponse> {
    return this.callEndpoint<ScreenshotResponse>('/screenshot', { url, fullPage });
  },

  async generatePDF(url: string): Promise<PDFResponse> {
    return this.callEndpoint<PDFResponse>('/generate-pdf', { url });
  },

  async scrapeData(url: string): Promise<ScrapeResponse> {
    return this.callEndpoint<ScrapeResponse>('/scrape', { url });
  },

  async getPageInfo(url: string): Promise<PageInfoResponse> {
    return this.callEndpoint<PageInfoResponse>('/page-info', { url });
  },

  async extractText(url: string, selector: string): Promise<APIResponse> {
    return this.callEndpoint<APIResponse>('/extract-text', { url, selector });
  }
};

export default api;
