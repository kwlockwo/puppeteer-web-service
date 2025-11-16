import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders main application', () => {
    render(<App />);
    
    expect(screen.getByText(/Puppeteer Web Service/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/example.com/i)).toBeInTheDocument();
  });

  test('renders all tabs', () => {
    render(<App />);
    
    expect(screen.getByText(/Screenshot/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Scrape Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Page Info/i)).toBeInTheDocument();
  });

  test('changes tab on click', () => {
    render(<App />);
    
    const pdfTab = screen.getByText(/PDF/i);
    fireEvent.click(pdfTab);
    
    expect(screen.getByRole('button', { name: /Generate PDF/i })).toBeInTheDocument();
  });

  test('handles screenshot capture', async () => {
    const mockResponse = {
      success: true,
      screenshot: 'base64screenshot',
      message: 'Screenshot captured successfully'
    };
    
    global.fetch.mockResolvedValueOnce({
      json: async () => mockResponse
    });

    render(<App />);
    
    const button = screen.getByRole('button', { name: /Take Screenshot/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Results/i)).toBeInTheDocument();
    });
  });

  test('displays error on failed request', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    
    const button = screen.getByRole('button', { name: /Take Screenshot/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  test('clears results when changing tabs', () => {
    const { rerender } = render(<App />);
    
    const screenshotTab = screen.getByText(/Screenshot/i);
    const pdfTab = screen.getByText(/PDF/i);
    
    fireEvent.click(screenshotTab);
    fireEvent.click(pdfTab);
    
    expect(screen.queryByText(/Results/i)).not.toBeInTheDocument();
  });

  test('updates URL input value', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    
    expect(input).toHaveValue('https://test.com');
  });

  test('shows loading state during API call', async () => {
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<App />);
    
    const button = screen.getByRole('button', { name: /Take Screenshot/i });
    fireEvent.click(button);

    expect(screen.getByText(/Capturing.../i)).toBeInTheDocument();
  });
});
