import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from '../../components/common/ErrorDisplay';

describe('ErrorDisplay Component', () => {
  test('does not render when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render when error is undefined', () => {
    const { container } = render(<ErrorDisplay error={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render when error is empty string', () => {
    const { container } = render(<ErrorDisplay error="" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders error message when error is provided', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorDisplay error={errorMessage} />);
    
    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('has correct styling for error display', () => {
    const { container } = render(<ErrorDisplay error="Test error" />);
    
    const errorDiv = container.firstChild;
    expect(errorDiv).toHaveClass('bg-red-50', 'border-red-200', 'text-red-700');
  });
});
