import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRepository } from '../useRepository';
import * as githubApi from '../../services/githubApi';
import { mockRepository, mockLanguages } from '../../test/mocks/githubApiMocks';

// Mock the GitHub API service
vi.mock('../../services/githubApi');

describe('useRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    vi.mocked(githubApi.fetchRepositoryDetails).mockReturnValue(new Promise(() => {}));
    vi.mocked(githubApi.fetchRepositoryLanguages).mockReturnValue(new Promise(() => {}));
    
    const { result } = renderHook(() => useRepository('test-repo'));

    expect(result.current.loading).toBe(true);
    expect(result.current.repository).toBeNull();
    expect(result.current.languages).toEqual({});
    expect(result.current.error).toBeNull();
  });

  it('should not fetch when repoName is not provided', () => {
    const { result } = renderHook(() => useRepository(null));

    expect(result.current.loading).toBe(true);
    expect(vi.mocked(githubApi.fetchRepositoryDetails)).not.toHaveBeenCalled();
    expect(vi.mocked(githubApi.fetchRepositoryLanguages)).not.toHaveBeenCalled();
  });

  it('should fetch repository and languages successfully', async () => {
    const transformedRepo = {
      ...mockRepository,
      transformed: true,
    };

    vi.mocked(githubApi.fetchRepositoryDetails).mockResolvedValue(mockRepository);
    vi.mocked(githubApi.fetchRepositoryLanguages).mockResolvedValue(mockLanguages);
    vi.mocked(githubApi.transformRepositoryData).mockReturnValue(transformedRepo);

    const { result } = renderHook(() => useRepository('mock-repo-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repository).toEqual(transformedRepo);
    expect(result.current.languages).toEqual(mockLanguages);
    expect(result.current.error).toBeNull();
    expect(vi.mocked(githubApi.fetchRepositoryDetails)).toHaveBeenCalledWith('mock-repo-1');
    expect(vi.mocked(githubApi.fetchRepositoryLanguages)).toHaveBeenCalledWith('mock-repo-1');
  });

  it('should handle repository fetch errors', async () => {
    const errorMessage = 'Repository not found';
    vi.mocked(githubApi.fetchRepositoryDetails).mockRejectedValue(new Error(errorMessage));
    vi.mocked(githubApi.fetchRepositoryLanguages).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useRepository('non-existent-repo'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.repository).toBeNull();
    expect(result.current.languages).toEqual({});
  });

  it('should calculate language statistics correctly', async () => {
    const transformedRepo = {
      ...mockRepository,
      transformed: true,
    };

    vi.mocked(githubApi.fetchRepositoryDetails).mockResolvedValue(mockRepository);
    vi.mocked(githubApi.fetchRepositoryLanguages).mockResolvedValue(mockLanguages);
    vi.mocked(githubApi.transformRepositoryData).mockReturnValue(transformedRepo);

    const { result } = renderHook(() => useRepository('mock-repo-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const { languageStats } = result.current;

    expect(languageStats).toHaveLength(4);
    expect(languageStats[0]).toEqual({
      language: 'JavaScript',
      bytes: 125000,
      percentage: '52.1', // 125000 / 240000 * 100
    });
    expect(languageStats[1]).toEqual({
      language: 'TypeScript',
      bytes: 75000,
      percentage: '31.3', // 75000 / 240000 * 100
    });
  });

  it('should handle empty languages response', async () => {
    const transformedRepo = {
      ...mockRepository,
      transformed: true,
    };

    vi.mocked(githubApi.fetchRepositoryDetails).mockResolvedValue(mockRepository);
    vi.mocked(githubApi.fetchRepositoryLanguages).mockResolvedValue({});
    vi.mocked(githubApi.transformRepositoryData).mockReturnValue(transformedRepo);

    const { result } = renderHook(() => useRepository('mock-repo-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.languageStats).toEqual([]);
  });

  it('should refetch data when called', async () => {
    const transformedRepo = {
      ...mockRepository,
      transformed: true,
    };

    vi.mocked(githubApi.fetchRepositoryDetails)
      .mockResolvedValueOnce(mockRepository)
      .mockResolvedValueOnce({ ...mockRepository, name: 'updated-repo' });
    vi.mocked(githubApi.fetchRepositoryLanguages).mockResolvedValue(mockLanguages);
    vi.mocked(githubApi.transformRepositoryData)
      .mockReturnValueOnce(transformedRepo)
      .mockReturnValueOnce({ ...transformedRepo, name: 'updated-repo' });

    const { result } = renderHook(() => useRepository('mock-repo-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repository.name).toBe(mockRepository.name);

    await waitFor(async () => {
      await result.current.refetch();
    });

    expect(result.current.repository.name).toBe('updated-repo');
  });

  it('should update when repoName changes', async () => {
    const transformedRepo1 = { ...mockRepository, name: 'repo-1' };
    const transformedRepo2 = { ...mockRepository, name: 'repo-2' };

    vi.mocked(githubApi.fetchRepositoryDetails)
      .mockResolvedValueOnce({ ...mockRepository, name: 'repo-1' })
      .mockResolvedValueOnce({ ...mockRepository, name: 'repo-2' });
    vi.mocked(githubApi.fetchRepositoryLanguages).mockResolvedValue(mockLanguages);
    vi.mocked(githubApi.transformRepositoryData)
      .mockReturnValueOnce(transformedRepo1)
      .mockReturnValueOnce(transformedRepo2);

    const { result, rerender } = renderHook(
      ({ repoName }) => useRepository(repoName),
      { initialProps: { repoName: 'repo-1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repository.name).toBe('repo-1');

    rerender({ repoName: 'repo-2' });

    await waitFor(() => {
      expect(result.current.repository.name).toBe('repo-2');
    });
  });
}); 