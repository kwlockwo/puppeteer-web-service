// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

// Screenshot Types
export interface ScreenshotResponse extends APIResponse {
  screenshot?: string;
}

export interface ScreenshotRequest {
  url: string;
  fullPage?: boolean;
}

// PDF Types
export interface PDFResponse extends APIResponse {
  pdf?: string;
  filename?: string;
}

export interface PDFRequest {
  url: string;
}

// Scraping Types
export interface Heading {
  tag: string;
  text: string;
}

export interface Link {
  href: string;
  text?: string;
}

export interface ScrapedData {
  title?: string;
  description?: string;
  metaDescription?: string;
  links?: Link[];
  images?: string[];
  headings?: Heading[];
}

export interface ScrapeResponse extends APIResponse {
  data?: ScrapedData;
}

export interface ScrapeRequest {
  url: string;
}

// Page Info Types
export interface PageInfoData {
  title?: string;
  url?: string;
  metaDescription?: string;
  headings?: Heading[];
  viewport?: { width: number; height: number };
  userAgent?: string;
  cookies?: Array<{ name: string; value: string; domain: string }>;
}

export interface PageInfoResponse extends APIResponse {
  data?: PageInfoData;
}

export interface PageInfoRequest {
  url: string;
}

// Extract Text Types
export interface ExtractTextRequest {
  url: string;
  selector: string;
}

export interface ExtractTextResponse extends APIResponse {
  text?: string;
}

// Union Types
export type APIResult = ScreenshotResponse | PDFResponse | ScrapeResponse | PageInfoResponse | ExtractTextResponse;
