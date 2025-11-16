import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../../components/common/Header';

describe('Header Component', () => {
  test('renders header with title', () => {
    render(<Header />);
    
    const heading = screen.getByRole('heading', { name: /Puppeteer Web Service/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders description text', () => {
    render(<Header />);
    
    const description = screen.getByText(/Automate web scraping, screenshots, and data extraction/i);
    expect(description).toBeInTheDocument();
  });

  test('renders globe icon', () => {
    const { container } = render(<Header />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('has correct styling classes', () => {
    const { container } = render(<Header />);
    
    const headerDiv = container.firstChild;
    expect(headerDiv).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
  });
});
