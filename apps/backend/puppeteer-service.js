const puppeteer = require('puppeteer');

let browser = null;
let defaultOptions = {
  headless: true,
  defaultTimeout: 30000,
  defaultViewport: { width: 1920, height: 1080 },
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

async function initBrowser(options = {}) {
  if (!browser) {
    const launchOptions = { ...defaultOptions, ...options };
    browser = await puppeteer.launch(launchOptions);
  }
  return browser;
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

async function createNewPage() {
  const browserInstance = await initBrowser();
  const page = await browserInstance.newPage();
  await page.setDefaultTimeout(defaultOptions.defaultTimeout);
  return page;
}

async function screenshot(url, options = {}) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector);
    }
    
    const screenshot = await page.screenshot({
      fullPage: options.fullPage || false,
      path: options.path,
      type: options.type || 'png'
    });
    
    return screenshot;
  } finally {
    await page.close();
  }
}

async function generatePDF(url, options = {}) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector);
    }
    
    const pdf = await page.pdf({
      path: options.path,
      format: options.format || 'A4',
      printBackground: options.printBackground !== false,
      margin: options.margin || { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    return pdf;
  } finally {
    await page.close();
  }
}

async function scrapeData(url, scraperFunction) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const data = await page.evaluate(scraperFunction);
    return data;
  } finally {
    await page.close();
  }
}

async function fillForm(url, formData, submitSelector) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    for (const [selector, value] of Object.entries(formData)) {
      await page.waitForSelector(selector);
      await page.type(selector, value);
    }
    
    if (submitSelector) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click(submitSelector)
      ]);
    }
    
    return { success: true, url: page.url() };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    await page.close();
  }
}

async function extractText(url, selector) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector(selector);
    const text = await page.$eval(selector, el => el.textContent.trim());
    return text;
  } finally {
    await page.close();
  }
}

async function waitForElement(url, selector, options = {}) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    await page.waitForSelector(selector, {
      timeout: options.timeout || defaultOptions.defaultTimeout,
      visible: options.visible !== false
    });
    
    return { found: true };
  } catch (err) {
    return { found: false, error: err.message };
  } finally {
    await page.close();
  }
}

async function executeScript(url, scriptFunction, ...args) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const result = await page.evaluate(scriptFunction, ...args);
    return result;
  } finally {
    await page.close();
  }
}

async function clickAndWait(url, selector, options = {}) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector(selector);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: options.waitUntil || 'networkidle2' }),
      page.click(selector)
    ]);
    
    return { success: true, url: page.url() };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    await page.close();
  }
}

async function getPageInfo(url) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const info = await page.evaluate(() => ({
      title: document.title,
      url: window.location.href,
      metaDescription: document.querySelector('meta[name="description"]')?.content || '',
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
        tag: h.tagName,
        text: h.textContent.trim()
      }))
    }));
    
    return info;
  } finally {
    await page.close();
  }
}

function setDefaultOptions(options) {
  defaultOptions = { ...defaultOptions, ...options };
}

module.exports = {
  initBrowser,
  closeBrowser,
  createNewPage,
  screenshot,
  generatePDF,
  scrapeData,
  fillForm,
  extractText,
  waitForElement,
  executeScript,
  clickAndWait,
  getPageInfo,
  setDefaultOptions
};

process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit();
});
