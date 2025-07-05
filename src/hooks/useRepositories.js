import { useState, useEffect, useMemo } from 'react';
import { fetchGoDaddyRepositories, transformRepositoryData } from '../services/githubApi';

export const useRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [filterLanguage, setFilterLanguage] = useState('');

  const loadRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGoDaddyRepositories();
      const transformedData = data.map(transformRepositoryData);
      setRepositories(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    error,
    searchTerm,
    sortBy,
    filterLanguage,
    availableLanguages,
    setSearchTerm,
    setSortBy,
    setFilterLanguage,
    refetch: loadRepositories,
    totalCount: repositories.length,
    filteredCount: filteredAndSortedRepositories.length
  };
}; 