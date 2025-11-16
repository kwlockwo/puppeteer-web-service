import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser | null = null;
let defaultOptions: any = {
  headless: true,
  defaultViewport: { width: 1920, height: 1080 },
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

const defaultTimeout = 30000;

export async function initBrowser(options: any = {}): Promise<Browser> {
  if (!browser) {
    const launchOptions = { ...defaultOptions, ...options };
    browser = await puppeteer.launch(launchOptions);
  }
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

export async function createNewPage(): Promise<Page> {
  const browserInstance = await initBrowser();
  const page = await browserInstance.newPage();
  await page.setDefaultTimeout(defaultTimeout);
  return page;
}

interface ScreenshotOptions {
  fullPage?: boolean;
  path?: string;
  type?: 'png' | 'jpeg' | 'webp';
  waitForSelector?: string;
}

export async function screenshot(url: string, options: ScreenshotOptions = {}): Promise<any> {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector);
    }

    const screenshot = await page.screenshot({
      fullPage: options.fullPage || false,
      path: (options.path as any),
      type: options.type || 'png'
    });

    return Buffer.from(screenshot);
  } finally {
    await page.close();
  }
}

interface PDFOptions {
  path?: string;
  format?: string;
  printBackground?: boolean;
  margin?: { top: string; right: string; bottom: string; left: string };
  waitForSelector?: string;
}

export async function generatePDF(url: string, options: PDFOptions = {}): Promise<any> {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector);
    }

    const pdf = await page.pdf({
      path: (options.path as any),
      format: (options.format as any) || 'A4',
      printBackground: options.printBackground !== false,
      margin: options.margin || { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    return pdf;
  } finally {
    await page.close();
  }
}

export async function scrapeData<T = any>(url: string, scraperFunction: string | ((...args: any[]) => T)): Promise<T> {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const data = await page.evaluate(scraperFunction as any);
    return data;
  } finally {
    await page.close();
  }
}

export async function fillForm(
  url: string,
  formData: Record<string, string>,
  submitSelector?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
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
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  } finally {
    await page.close();
  }
}

export async function extractText(url: string, selector: string): Promise<string> {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector(selector);
    const text = await page.$eval(selector, (el) => el.textContent?.trim() || '');
    return text;
  } finally {
    await page.close();
  }
}

interface WaitOptions {
  timeout?: number;
  visible?: boolean;
}

export async function waitForElement(
  url: string,
  selector: string,
  options: WaitOptions = {}
): Promise<{ found: boolean; error?: string }> {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector(selector, {
      timeout: options.timeout || defaultTimeout,
      visible: options.visible !== false
    });

    return { found: true };
  } catch (err) {
    return { found: false, error: err instanceof Error ? err.message : 'Unknown error' };
  } finally {
    await page.close();
  }
}

export async function executeScript<T = unknown>(
  url: string,
  scriptFunction: (...args: unknown[]) => T,
  ...args: unknown[]
): Promise<T> {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const result = await page.evaluate(scriptFunction, ...args);
    return result;
  } finally {
    await page.close();
  }
}

interface ClickOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
}

export async function clickAndWait(
  url: string,
  selector: string,
  options: ClickOptions = {}
): Promise<{ success: boolean; url?: string; error?: string }> {
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
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  } finally {
    await page.close();
  }
}

export async function getPageInfo(url: string) {
  const page = await createNewPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    const info = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map((h) => ({
          tag: h.tagName,
          text: h.textContent?.trim() || ''
        }))
      };
    });

    return info;
  } finally {
    await page.close();
  }
}

export function setDefaultOptions(options: any): void {
  defaultOptions = { ...defaultOptions, ...options };
}

process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit();
});
