import { useRepositories } from '../hooks/useRepositories';
import RepositoryCard from './RepositoryCard';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import Loading from './Loading';
import Error from './Error';

const RepositoryList = () => {
  const {
    repositories,
    loading,
    error,
    searchTerm,
    sortBy,
    filterLanguage,
    availableLanguages,
    setSearchTerm,
    setSortBy,
    setFilterLanguage,
    refetch,
    totalCount,
    filteredCount
  } = useRepositories();

  if (loading) {
    return <Loading message="Loading GoDaddy repositories..." />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GoDaddy Repositories</h1>
        <p className="text-gray-600">Explore {totalCount} repositories from GoDaddy's GitHub organization</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search repositories..."
        />
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterLanguage={filterLanguage}
          onLanguageChange={setFilterLanguage}
          availableLanguages={availableLanguages}
          filteredCount={filteredCount}
          totalCount={totalCount}
        />
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repository) => (
          <RepositoryCard key={repository.id} repository={repository} />
        ))}
      </div>

      {repositories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No repositories found matching "{searchTerm}"</p>
        </div>
      )}

      {repositories.length === 0 && filterLanguage && !searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No repositories found for "{filterLanguage}"</p>
        </div>
      )}
    </div>
  );
};

export default RepositoryList; 