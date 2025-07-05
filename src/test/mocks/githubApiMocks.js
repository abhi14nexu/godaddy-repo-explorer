// Mock repository data that mimics GitHub API response
export const mockRepositories = [
  {
    id: 1,
    name: 'mock-repo-1',
    full_name: 'godaddy/mock-repo-1',
    description: 'A mock repository for testing purposes',
    html_url: 'https://github.com/godaddy/mock-repo-1',
    language: 'JavaScript',
    forks_count: 15,
    open_issues_count: 3,
    watchers_count: 25,
    stargazers_count: 42,
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2024-12-01T14:20:00Z',
    pushed_at: '2024-11-30T09:15:00Z',
    size: 1024,
    default_branch: 'main',
    private: false,
    archived: false,
    disabled: false,
    topics: ['javascript', 'react', 'testing'],
    license: {
      name: 'MIT License',
    },
  },
  {
    id: 2,
    name: 'mock-repo-2',
    full_name: 'godaddy/mock-repo-2',
    description: 'Another test repository with different language',
    html_url: 'https://github.com/godaddy/mock-repo-2',
    language: 'Python',
    forks_count: 8,
    open_issues_count: 1,
    watchers_count: 12,
    stargazers_count: 18,
    created_at: '2023-06-20T08:45:00Z',
    updated_at: '2024-11-28T16:30:00Z',
    pushed_at: '2024-11-27T11:20:00Z',
    size: 512,
    default_branch: 'main',
    private: false,
    archived: false,
    disabled: false,
    topics: ['python', 'api', 'backend'],
    license: {
      name: 'Apache License 2.0',
    },
  },
  {
    id: 3,
    name: 'private-repo',
    full_name: 'godaddy/private-repo',
    description: 'A private repository',
    html_url: 'https://github.com/godaddy/private-repo',
    language: 'TypeScript',
    forks_count: 2,
    open_issues_count: 0,
    watchers_count: 5,
    stargazers_count: 8,
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-12-05T10:15:00Z',
    pushed_at: '2024-12-04T15:45:00Z',
    size: 256,
    default_branch: 'main',
    private: true,
    archived: false,
    disabled: false,
    topics: ['typescript', 'private'],
    license: null,
  },
];

// Mock single repository response
export const mockRepository = mockRepositories[0];

// Mock languages response
export const mockLanguages = {
  JavaScript: 125000,
  TypeScript: 75000,
  CSS: 25000,
  HTML: 15000,
};

// Mock API error responses
export const mockApiError = {
  response: {
    status: 404,
    data: {
      message: 'Not Found',
    },
  },
};

export const mockNetworkError = {
  request: {},
  message: 'Network Error',
};

// Helper function to create mock API responses
export const createMockApiResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

// Mock fetch functions
export const mockFetchRepositories = vi.fn(() => 
  Promise.resolve(createMockApiResponse(mockRepositories))
);

export const mockFetchRepository = vi.fn((repoName) => {
  const repo = mockRepositories.find(r => r.name === repoName);
  if (repo) {
    return Promise.resolve(createMockApiResponse(repo));
  }
  return Promise.reject(mockApiError);
});

export const mockFetchLanguages = vi.fn(() => 
  Promise.resolve(createMockApiResponse(mockLanguages))
); 