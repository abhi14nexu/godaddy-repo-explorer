import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen } from '../../test/utils/test-utils';
import Breadcrumb from '../Breadcrumb';

const mockItems = [
  { label: 'Home', href: '/' },
  { label: 'Repositories', href: '/repositories' },
  { label: 'Current Page' },
];

describe('Breadcrumb', () => {
  it('renders all breadcrumb items', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Repositories')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const repositoriesLink = screen.getByRole('link', { name: 'Repositories' });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(repositoriesLink).toHaveAttribute('href', '/repositories');
  });

  it('renders text without link for items without href', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);
    
    const currentPage = screen.getByText('Current Page');
    expect(currentPage.tagName).toBe('SPAN');
    expect(currentPage).toHaveClass('text-gray-900', 'font-medium');
  });

  it('renders separators between items', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);
    
    // SVG chevron icons are used as separators
    const separators = screen.getAllByRole('img', { hidden: true });
    expect(separators).toHaveLength(2); // 3 items = 2 separators
  });

  it('renders single item without separator', () => {
    const singleItem = [{ label: 'Only Item' }];
    renderWithRouter(<Breadcrumb items={singleItem} />);
    
    expect(screen.getByText('Only Item')).toBeInTheDocument();
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('renders empty breadcrumb when no items provided', () => {
    renderWithRouter(<Breadcrumb items={[]} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav.children).toHaveLength(1); // Only the ol element
  });

  it('has correct navigation semantics', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);
    
    const nav = screen.getByRole('navigation');
    const list = screen.getByRole('list');
    const listItems = screen.getAllByRole('listitem');
    
    expect(nav).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(listItems).toHaveLength(3);
  });

  it('applies hover styles to links', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveClass('hover:text-gray-700');
  });
}); 