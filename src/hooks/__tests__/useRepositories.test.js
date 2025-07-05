import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRepositories } from '../useRepositories';
import * as githubApi from '../../services/githubApi';
import { mockRepositories } from '../../test/mocks/githubApiMocks';

// Mock the GitHub API service
vi.mock('../../services/githubApi');

describe('useRepositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    vi.mocked(githubApi.fetchGoDaddyRepositories).mockReturnValue(new Promise(() => {}));
    
    const { result } = renderHook(() => useRepositories());

    expect(result.current.loading).toBe(true);
    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch repositories successfully', async () => {
    vi.mocked(githubApi.fetchGoDaddyRepositories).mockResolvedValue(mockRepositories);
    vi.mocked(githubApi.transformRepositoryData).mockImplementation((repo) => ({
      ...repo,
      transformed: true,
    }));

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toHaveLength(3);
    expect(result.current.error).toBeNull();
    expect(result.current.totalCount).toBe(3);
    expect(result.current.filteredCount).toBe(3);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'API Error: 500 - Server Error';
    vi.mocked(githubApi.fetchGoDaddyRepositories).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.repositories).toEqual([]);
  });

  it('should filter repositories by search term', async () => {
    const transformedRepos = mockRepositories.map(repo => ({
      ...repo,
      name: repo.name,
      description: repo.description,
    }));

    vi.mocked(githubApi.fetchGoDaddyRepositories).mockResolvedValue(mockRepositories);
    vi.mocked(githubApi.transformRepositoryData).mockImplementation((repo) => 
      transformedRepos.find(r => r.id === repo.id)
    );

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm('mock-repo-1');
    });

    expect(result.current.repositories).toHaveLength(1);
    expect(result.current.repositories[0].name).toBe('mock-repo-1');
    expect(result.current.filteredCount).toBe(1);
  });

  it('should filter repositories by language', async () => {
    const transformedRepos = mockRepositories.map(repo => ({
      ...repo,
      language: repo.language,
    }));

    vi.mocked(githubApi.fetchGoDaddyRepositories).mockResolvedValue(mockRepositories);
    vi.mocked(githubApi.transformRepositoryData).mockImplementation((repo) => 
      transformedRepos.find(r => r.id === repo.id)
    );

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setFilterLanguage('JavaScript');
    });

    expect(result.current.repositories).toHaveLength(1);
    expect(result.current.repositories[0].language).toBe('JavaScript');
  });

  it('should sort repositories correctly', async () => {
    const transformedRepos = mockRepositories.map(repo => ({
      ...repo,
      name: repo.name,
      stargazersCount: repo.stargazers_count,
      updatedAt: repo.updated_at,
    }));

    vi.mocked(githubApi.fetchGoDaddyRepositories).mockResolvedValue(mockRepositories);
    vi.mocked(githubApi.transformRepositoryData).mockImplementation((repo) => 
      transformedRepos.find(r => r.id === repo.id)
    );

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Test sort by name
    act(() => {
      result.current.setSortBy('name');
    });

    expect(result.current.repositories[0].name).toBe('mock-repo-1');
    expect(result.current.repositories[1].name).toBe('mock-repo-2');

    // Test sort by stars
    act(() => {
      result.current.setSortBy('stars');
    });

    expect(result.current.repositories[0].stargazersCount).toBe(42); // highest stars first
  });

  it('should provide available languages', async () => {
    const transformedRepos = mockRepositories.map(repo => ({
      ...repo,
      language: repo.language,
    }));

    vi.mocked(githubApi.fetchGoDaddyRepositories).mockResolvedValue(mockRepositories);
    vi.mocked(githubApi.transformRepositoryData).mockImplementation((repo) => 
      transformedRepos.find(r => r.id === repo.id)
    );

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.availableLanguages).toEqual(['JavaScript', 'Python', 'TypeScript']);
  });

  it('should allow refetching data', async () => {
    vi.mocked(githubApi.fetchGoDaddyRepositories)
      .mockResolvedValueOnce([mockRepositories[0]])
      .mockResolvedValueOnce(mockRepositories);

    const { result } = renderHook(() => useRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalCount).toBe(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.totalCount).toBe(3);
  });
}); 