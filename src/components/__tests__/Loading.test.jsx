import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils/test-utils';
import Loading from '../ui/Loading';

describe('Loading', () => {
  it('renders with default message', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Loading repositories...';
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders with percentage display', () => {
    render(<Loading />);
    
    // Check if percentage is displayed (it starts at 0% and animates)
    expect(screen.getByText(/\d+%/)).toBeInTheDocument();
  });

  it('has correct CSS classes for styling', () => {
    render(<Loading />);
    
    const container = screen.getByText('Loading...').closest('div').parentElement;
    expect(container).toHaveClass('fixed', 'inset-0', 'flex', 'items-center', 'justify-center');
  });
}); 