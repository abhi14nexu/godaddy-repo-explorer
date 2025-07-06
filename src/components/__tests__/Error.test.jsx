import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import Error from '../ui/Error';

describe('Error', () => {
  it('renders with default message', () => {
    render(<Error />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Failed to load repositories';
    render(<Error message={customMessage} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<Error onRetry={onRetry} />);
    
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<Error />);
    
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<Error onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: 'Try again' });
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has correct error icon', () => {
    render(<Error />);
    
    const errorIcon = screen.getByRole('img', { hidden: true });
    expect(errorIcon).toBeInTheDocument();
  });
}); 