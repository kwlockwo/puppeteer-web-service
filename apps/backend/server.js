const express = require('express');
const cors = require('cors');
const {
  screenshot,
  generatePDF,
  scrapeData,
  getPageInfo,
  extractText,
  closeBrowser
} = require('./puppeteer-service');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Puppeteer service is running' });
});

app.post('/api/screenshot', async (req, res) => {
  try {
    const { url, fullPage } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const screenshotBuffer = await screenshot(url, { fullPage });
    
    res.json({
      success: true,
      screenshot: screenshotBuffer.toString('base64'),
      message: 'Screenshot captured successfully'
    });
  } catch (err) {
    console.error('Screenshot error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const pdfBuffer = await generatePDF(url);
    
    res.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      message: 'PDF generated successfully'
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const data = await scrapeData(url, () => {
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
          tag: h.tagName,
          text: h.textContent.trim()
        })),
        links: Array.from(document.querySelectorAll('a')).slice(0, 10).map(a => ({
          text: a.textContent.trim(),
          href: a.href
        })),
        paragraphs: Array.from(document.querySelectorAll('p')).slice(0, 5).map(p =>
          p.textContent.trim()
        )
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/page-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const info = await getPageInfo(url);
    
    res.json({ success: true, info });
  } catch (err) {
    console.error('Page info error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/extract-text', async (req, res) => {
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
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
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

module.exports = app;
