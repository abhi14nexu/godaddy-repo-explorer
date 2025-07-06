import { useState, useEffect, useMemo } from 'react';
import { fetchGoDaddyRepositories, transformRepositoryData } from '../services/githubApi';

// Simple cache with 5 minute expiry
const CACHE_KEY = 'godaddy_repositories';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const getFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore cache errors
  }
};

export const useRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadRepositories = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      
      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedData = getFromCache();
        if (cachedData) {
          setRepositories(cachedData.repositories || cachedData);
          setHasMore(cachedData.hasMore !== undefined ? cachedData.hasMore : false);
          setLoading(false);
          return;
        }
      }
      
      // Fetch from API
      const reposData = await fetchGoDaddyRepositories(1, 30);
      const transformedData = reposData.repositories.map(transformRepositoryData);
      
      // Cache the data
      const cacheData = {
        repositories: transformedData,
        hasMore: reposData.hasMore
      };
      setCache(cacheData);
      
      setRepositories(transformedData);
      setHasMore(reposData.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreRepositories = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      
      const nextPage = currentPage + 1;
      const data = await fetchGoDaddyRepositories(nextPage, 30);
      const transformedData = data.repositories.map(transformRepositoryData);
      
      setRepositories(prev => [...prev, ...transformedData]);
      setCurrentPage(nextPage);
      setHasMore(data.hasMore);
      
             // Update cache with new data
       const updatedRepositories = [...repositories, ...transformedData];
       const cacheData = {
         repositories: updatedRepositories,
         hasMore: data.hasMore
       };
       setCache(cacheData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  // Get unique languages for filtering
  const availableLanguages = useMemo(() => {
    const languages = repositories
      .map(repo => repo.language)
      .filter(lang => lang !== null && lang !== undefined)
      .filter((lang, index, array) => array.indexOf(lang) === index)
      .sort();
    return languages;
  }, [repositories]);

  // Filter and sort repositories
  const filteredAndSortedRepositories = useMemo(() => {
    let filtered = repositories;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply language filter
    if (filterLanguage) {
      filtered = filtered.filter(repo => repo.language === filterLanguage);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stargazersCount - a.stargazersCount;
        case 'forks':
          return b.forksCount - a.forksCount;
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return sorted;
  }, [repositories, searchTerm, filterLanguage, sortBy]);

  return {
    repositories: filteredAndSortedRepositories,
    loading,
    loadingMore,
    error,
    searchTerm,
    sortBy,
    filterLanguage,
    availableLanguages,
    hasMore,
    setSearchTerm,
    setSortBy,
    setFilterLanguage,
    refetch: loadRepositories,
    loadMore: loadMoreRepositories,
    filteredCount: filteredAndSortedRepositories.length
  };
}; 