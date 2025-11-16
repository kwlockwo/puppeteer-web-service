import {
  initBrowser,
  closeBrowser,
  screenshot,
  generatePDF,
  scrapeData
} from '../src/puppeteer-service';

describe('Puppeteer Service', () => {
  beforeAll(async () => {
    await initBrowser();
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('Browser Management', () => {
    test('should initialize browser', async () => {
      const browser = await initBrowser();
      expect(browser).toBeDefined();
    });
  });

  describe('Screenshot Function', () => {
    test('should capture screenshot', async () => {
      const result = await screenshot('https://example.com', { fullPage: false });
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('PDF Generation', () => {
    test('should generate PDF', async () => {
      const result = await generatePDF('https://example.com');
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Scrape Data', () => {
    test('should scrape data', async () => {
      const result = await scrapeData('https://example.com', () => ({
        title: document.title
      }));
      expect(result).toHaveProperty('title');
    });
  });
});
