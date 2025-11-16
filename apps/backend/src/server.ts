import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'node:path';
import {
  screenshot,
  generatePDF,
  scrapeData,
  getPageInfo,
  extractText,
  closeBrowser
} from './puppeteer-service';
import type {
  ScreenshotRequest,
  ScreenshotResponse,
  PDFRequest,
  PDFResponse,
  ScrapeRequest,
  ScrapeResponse,
  PageInfoRequest,
  PageInfoResponse,
  ExtractTextRequest,
  ExtractTextResponse
} from '@puppeteer-service/shared';

const app = express();
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3001;

app.use(cors());
app.use(express.json());

// Serve static files from frontend dist
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Puppeteer service is running' });
});

app.post('/api/screenshot', async (req: Request<{}, {}, ScreenshotRequest>, res: Response<ScreenshotResponse>) => {
  try {
    const { url, fullPage } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const screenshotBuffer = await screenshot(url, { fullPage });

    res.json({
      success: true,
      screenshot: screenshotBuffer.toString('base64'),
    });
  } catch (err) {
    console.error('Screenshot error:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

app.post('/api/generate-pdf', async (req: Request<{}, {}, PDFRequest>, res: Response<PDFResponse>) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const pdfBuffer = await generatePDF(url);

    res.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

app.post('/api/scrape', async (req: Request<{}, {}, ScrapeRequest>, res: Response<ScrapeResponse>) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const data = await scrapeData(url, () => {
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map((h) => ({
          tag: h.tagName,
          text: h.textContent?.trim() || ''
        })),
        links: Array.from(document.querySelectorAll('a'))
          .slice(0, 10)
          .map((a) => ({
            text: a.textContent?.trim() || '',
            href: a.href
          })),
        paragraphs: Array.from(document.querySelectorAll('p'))
          .slice(0, 5)
          .map((p) => p.textContent?.trim() || '')
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

app.post('/api/page-info', async (req: Request<{}, {}, PageInfoRequest>, res: Response<PageInfoResponse>) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const data = await getPageInfo(url);

    res.json({ success: true, data });
  } catch (err) {
    console.error('Page info error:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

app.post('/api/extract-text', async (req: Request<{}, {}, ExtractTextRequest>, res: Response<ExtractTextResponse>) => {
  try {
    const { url, selector } = req.body;

    if (!url || !selector) {
      return res.status(400).json({
        success: false,
        error: 'URL and selector are required'
      });
    }

    const text = await extractText(url, selector);

    res.json({ success: true, text });
  } catch (err) {
    console.error('Extract text error:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// Catch-all route to serve frontend for non-API routes
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const server = app.listen(port, () => {
  console.log(`Puppeteer service running on http://localhost:${port}`);
});

const shutdown = async () => {
  console.log('\nShutting down gracefully...');

  server.close(async () => {
    console.log('HTTP server closed');
    await closeBrowser();
    console.log('Browser closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
