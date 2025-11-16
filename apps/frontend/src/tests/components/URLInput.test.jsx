import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import URLInput from '../../components/common/URLInput';

describe('URLInput Component', () => {
  test('renders input with label', () => {
    const setUrl = vi.fn();
    render(<URLInput url="" setUrl={setUrl} />);
    
    const label = screen.getByText(/Website URL/i);
    expect(label).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);
    expect(input).toBeInTheDocument();
  });

  test('displays current URL value', () => {
    const setUrl = vi.fn();
    const testUrl = 'https://test.com';
    
    render(<URLInput url={testUrl} setUrl={setUrl} />);
    
    const input = screen.getByDisplayValue(testUrl);
    expect(input).toBeInTheDocument();
  });

  test('calls setUrl when input changes', () => {
    const setUrl = vi.fn();
    render(<URLInput url="" setUrl={setUrl} />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);
    fireEvent.change(input, { target: { value: 'https://new-url.com' } });
    
    expect(setUrl).toHaveBeenCalledWith('https://new-url.com');
  });

  test('has correct input type', () => {
    const setUrl = vi.fn();
    render(<URLInput url="" setUrl={setUrl} />);
    
    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);
    expect(input).toHaveAttribute('type', 'url');
  });
});
