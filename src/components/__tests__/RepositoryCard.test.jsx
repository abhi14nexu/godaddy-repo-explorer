import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen } from '../../test/utils/test-utils';
import RepositoryCard from '../features/repository/RepositoryCard';
import { mockRepositories } from '../../test/mocks/githubApiMocks';

// Transform mock data to match component expectations
const transformedRepo = {
  id: mockRepositories[0].id,
  name: mockRepositories[0].name,
  description: mockRepositories[0].description,
  language: mockRepositories[0].language,
  stargazersCount: mockRepositories[0].stargazers_count,
  forksCount: mockRepositories[0].forks_count,
  updatedAt: mockRepositories[0].updated_at,
  isPrivate: mockRepositories[0].private,
};

const privateRepo = {
  ...transformedRepo,
  id: 999,
  name: 'private-repo',
  isPrivate: true,
};

describe('RepositoryCard', () => {
  it('renders repository information correctly', () => {
    renderWithRouter(<RepositoryCard repository={transformedRepo} />);
    
    expect(screen.getByText(transformedRepo.name)).toBeInTheDocument();
    expect(screen.getByText(transformedRepo.description)).toBeInTheDocument();
    expect(screen.getByText(transformedRepo.language)).toBeInTheDocument();
    expect(screen.getByText(transformedRepo.stargazersCount.toString())).toBeInTheDocument();
    expect(screen.getByText(transformedRepo.forksCount.toString())).toBeInTheDocument();
  });

  it('renders private badge for private repositories', () => {
    renderWithRouter(<RepositoryCard repository={privateRepo} />);
    
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('does not render private badge for public repositories', () => {
    renderWithRouter(<RepositoryCard repository={transformedRepo} />);
    
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('renders fallback message when description is missing', () => {
    const repoWithoutDescription = {
      ...transformedRepo,
      description: null,
    };
    
    renderWithRouter(<RepositoryCard repository={repoWithoutDescription} />);
    
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('does not render language when not available', () => {
    const repoWithoutLanguage = {
      ...transformedRepo,
      language: null,
    };
    
    renderWithRouter(<RepositoryCard repository={repoWithoutLanguage} />);
    
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
  });

  it('has correct link to repository detail page', () => {
    renderWithRouter(<RepositoryCard repository={transformedRepo} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/repository/${transformedRepo.name}`);
  });

  it('formats date correctly', () => {
    renderWithRouter(<RepositoryCard repository={transformedRepo} />);
    
    // Check if a date is displayed (format: Dec 1, 2024)
    expect(screen.getByText(/\w{3} \d{1,2}, \d{4}/)).toBeInTheDocument();
  });

  it('has hover effects styling', () => {
    renderWithRouter(<RepositoryCard repository={transformedRepo} />);
    
    const card = screen.getByRole('link');
    expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow');
  });
}); 