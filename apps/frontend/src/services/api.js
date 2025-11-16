const API_URL = 'http://localhost:3001/api';

export const api = {
  async callEndpoint(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
  },

  async screenshot(url, fullPage = true) {
    return this.callEndpoint('/screenshot', { url, fullPage });
  },

  async generatePDF(url) {
    return this.callEndpoint('/generate-pdf', { url });
  },

  async scrapeData(url) {
    return this.callEndpoint('/scrape', { url });
  },

  async getPageInfo(url) {
    return this.callEndpoint('/page-info', { url });
  },

  async extractText(url, selector) {
    return this.callEndpoint('/extract-text', { url, selector });
  }
};

export default api;
