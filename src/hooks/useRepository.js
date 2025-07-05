import { useState, useEffect } from 'react';
import { fetchRepositoryDetails, fetchRepositoryLanguages, transformRepositoryData } from '../services/githubApi';

export const useRepository = (repoName) => {
  const [repository, setRepository] = useState(null);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRepositoryData = async () => {
    if (!repoName) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [repoData, languagesData] = await Promise.all([
        fetchRepositoryDetails(repoName),
        fetchRepositoryLanguages(repoName)
      ]);
      
      setRepository(transformRepositoryData(repoData));
      setLanguages(languagesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoName) {
      loadRepositoryData();
    }
  }, [repoName]);

  // Calculate language percentages
  const languageStats = (() => {
    if (!languages || Object.keys(languages).length === 0) return [];
    
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    return Object.entries(languages)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage: ((bytes / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.bytes - a.bytes);
  })();

  return {
    repository,
    languages,
    languageStats,
    loading,
    error,
    refetch: loadRepositoryData
  };
}; 