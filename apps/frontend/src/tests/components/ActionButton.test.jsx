import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from '../../components/common/ActionButton';

describe('ActionButton Component', () => {
  test('renders button with children text', () => {
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick} color="blue">Click Me</ActionButton>);
    
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick} color="blue">Click Me</ActionButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when loading prop is true', () => {
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick} loading={true} color="blue">Click Me</ActionButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('is disabled when disabled prop is true', () => {
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick} disabled={true} color="blue">Click Me</ActionButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick} disabled={true} color="blue">Click Me</ActionButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).not.toHaveBeenCalled();
  });

  test('applies correct color class for blue', () => {
    const onClick = vi.fn();
    const { container } = render(<ActionButton onClick={onClick} color="blue">Click Me</ActionButton>);
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
  });

  test('applies correct color class for purple', () => {
    const onClick = vi.fn();
    const { container } = render(<ActionButton onClick={onClick} color="purple">Click Me</ActionButton>);
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-purple-600', 'hover:bg-purple-700');
  });
});
