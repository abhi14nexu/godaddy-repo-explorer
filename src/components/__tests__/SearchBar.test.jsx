import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import SearchBar from '../ui/SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    const onSearchChange = vi.fn();
    render(<SearchBar searchTerm="" onSearchChange={onSearchChange} />);
    
    expect(screen.getByPlaceholderText('Search repositories...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const onSearchChange = vi.fn();
    const customPlaceholder = 'Find your repository...';
    render(
      <SearchBar 
        searchTerm="" 
        onSearchChange={onSearchChange} 
        placeholder={customPlaceholder}
      />
    );
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('displays current search term', () => {
    const onSearchChange = vi.fn();
    const searchTerm = 'react';
    render(<SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />);
    
    const input = screen.getByDisplayValue(searchTerm);
    expect(input).toBeInTheDocument();
  });

  it('calls onSearchChange when user types', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<SearchBar searchTerm="" onSearchChange={onSearchChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    
    expect(onSearchChange).toHaveBeenCalledTimes(4); // one for each character
    expect(onSearchChange).toHaveBeenLastCalledWith('test');
  });

  it('calls onSearchChange when input is cleared', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<SearchBar searchTerm="test" onSearchChange={onSearchChange} />);
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    expect(onSearchChange).toHaveBeenCalledWith('');
  });

  it('has search icon', () => {
    const onSearchChange = vi.fn();
    render(<SearchBar searchTerm="" onSearchChange={onSearchChange} />);
    
    const searchIcon = screen.getByRole('img', { hidden: true });
    expect(searchIcon).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const onSearchChange = vi.fn();
    render(<SearchBar searchTerm="" onSearchChange={onSearchChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('block', 'w-full', 'pl-10');
  });
}); 