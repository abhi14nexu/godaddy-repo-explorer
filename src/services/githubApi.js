import axios from 'axios';

const BASE_URL = 'https://api.github.com';
const ORG_NAME = 'godaddy';

// Create an Axios instance with default config — used for all GitHub API requests.
// Avoids repeating axios.get/post with headers and baseURL each time.
// 'application/vnd.github.v3+json' specifies GitHub API v3 response format.
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle GitHub API rate limiting gracefully.(60 requests per hour)
// If a 403 status is returned due to rate limits, show a clear error message instead of a generic failure.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to GitHub API');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
);

/**
 * Fetch all repositories for GoDaddy organization
 * @returns {Promise<Array>} Array of repository objects
 */
export const fetchGoDaddyRepositories = async () => {
  try {
    const response = await api.get(`/orgs/${ORG_NAME}/repos`, {
      params: {
        per_page: 100, // Get up to 100 repositories
        sort: 'updated',
        direction: 'desc',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

/**
 * Fetch a specific repository by name
 * @param {string} repoName - The name of the repository
 * @returns {Promise<Object>} Repository object
 */
export const fetchRepositoryDetails = async (repoName) => {
  try {
    const response = await api.get(`/repos/${ORG_NAME}/${repoName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching repository details:', error);
    throw error;
  }
};

/**
 * Fetch repository languages
 * @param {string} repoName - The name of the repository
 * @returns {Promise<Object>} Languages object with language usage
 */
export const fetchRepositoryLanguages = async (repoName) => {
  try {
    const response = await api.get(`/repos/${ORG_NAME}/${repoName}/languages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching repository languages:', error);
    throw error;
  }
};

/**
 * Transform repository data for display
 * @param {Object} repo - Raw repository data from GitHub API
 * @returns {Object} Formatted repository data
 */
export const transformRepositoryData = (repo) => {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    language: repo.language,
    forksCount: repo.forks_count,
    openIssuesCount: repo.open_issues_count,
    watchersCount: repo.watchers_count,
    stargazersCount: repo.stargazers_count,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    size: repo.size,
    defaultBranch: repo.default_branch,
    isPrivate: repo.private,
    isArchived: repo.archived,
    isDisabled: repo.disabled,
    topics: repo.topics || [],
    license: repo.license ? repo.license.name : null,
  };
}; 