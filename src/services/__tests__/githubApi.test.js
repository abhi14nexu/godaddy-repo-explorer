import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import {
  fetchGoDaddyRepositories,
  fetchRepositoryDetails,
  fetchRepositoryLanguages,
  transformRepositoryData,
} from '../githubApi';
import {
  mockRepositories,
  mockRepository,
  mockLanguages,
  mockApiError,
  createMockApiResponse,
} from '../../test/mocks/githubApiMocks';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('githubApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchGoDaddyRepositories', () => {
    it('should fetch all repositories with pagination', async () => {
      // Mock first page with 100 items
      const firstPageRepos = Array(100).fill(null).map((_, index) => ({
        ...mockRepository,
        id: index + 1,
        name: `repo-${index + 1}`,
      }));

      // Mock second page with 50 items (less than 100, so last page)
      const secondPageRepos = Array(50).fill(null).map((_, index) => ({
        ...mockRepository,
        id: index + 101,
        name: `repo-${index + 101}`,
      }));

      mockedAxios.create.mockReturnValue({
        get: vi.fn()
          .mockResolvedValueOnce(createMockApiResponse(firstPageRepos))
          .mockResolvedValueOnce(createMockApiResponse(secondPageRepos)),
      });

      const result = await fetchGoDaddyRepositories();

      expect(result).toHaveLength(150);
      expect(result[0].name).toBe('repo-1');
      expect(result[149].name).toBe('repo-150');
    });

    it('should handle single page response', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(createMockApiResponse(mockRepositories)),
      });

      const result = await fetchGoDaddyRepositories();

      expect(result).toEqual(mockRepositories);
    });

    it('should handle API errors', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(mockApiError),
      });

      await expect(fetchGoDaddyRepositories()).rejects.toThrow();
    });
  });

  describe('fetchRepositoryDetails', () => {
    it('should fetch repository details successfully', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(createMockApiResponse(mockRepository)),
      });

      const result = await fetchRepositoryDetails('mock-repo-1');

      expect(result).toEqual(mockRepository);
    });

    it('should handle repository not found', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(mockApiError),
      });

      await expect(fetchRepositoryDetails('non-existent-repo')).rejects.toThrow();
    });
  });

  describe('fetchRepositoryLanguages', () => {
    it('should fetch repository languages successfully', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(createMockApiResponse(mockLanguages)),
      });

      const result = await fetchRepositoryLanguages('mock-repo-1');

      expect(result).toEqual(mockLanguages);
    });

    it('should handle language fetch errors', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(mockApiError),
      });

      await expect(fetchRepositoryLanguages('non-existent-repo')).rejects.toThrow();
    });
  });

  describe('transformRepositoryData', () => {
    it('should transform repository data correctly', () => {
      const result = transformRepositoryData(mockRepository);

      expect(result).toEqual({
        id: mockRepository.id,
        name: mockRepository.name,
        fullName: mockRepository.full_name,
        description: mockRepository.description,
        htmlUrl: mockRepository.html_url,
        language: mockRepository.language,
        forksCount: mockRepository.forks_count,
        openIssuesCount: mockRepository.open_issues_count,
        watchersCount: mockRepository.watchers_count,
        stargazersCount: mockRepository.stargazers_count,
        createdAt: mockRepository.created_at,
        updatedAt: mockRepository.updated_at,
        pushedAt: mockRepository.pushed_at,
        size: mockRepository.size,
        defaultBranch: mockRepository.default_branch,
        isPrivate: mockRepository.private,
        isArchived: mockRepository.archived,
        isDisabled: mockRepository.disabled,
        topics: mockRepository.topics,
        license: mockRepository.license.name,
      });
    });

    it('should handle repository without license', () => {
      const repoWithoutLicense = { ...mockRepository, license: null };
      const result = transformRepositoryData(repoWithoutLicense);

      expect(result.license).toBeNull();
    });

    it('should handle repository without topics', () => {
      const repoWithoutTopics = { ...mockRepository, topics: undefined };
      const result = transformRepositoryData(repoWithoutTopics);

      expect(result.topics).toEqual([]);
    });
  });
}); 