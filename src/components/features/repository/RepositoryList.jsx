import { useRepositories } from '../../../hooks/useRepositories';
import RepositoryCard from './RepositoryCard';
import { SearchBar, FilterBar, Loading, Error } from '../../ui';

const RepositoryList = () => {
  const {
    repositories,
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
    refetch,
    loadMore,
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
        <p className="text-gray-600">Explore repositories from GoDaddy's GitHub organization</p>
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
        />
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {repositories.map((repository) => (
          <RepositoryCard key={repository.id} repository={repository} />
        ))}
      </div>

      {/* Load More Button */}
      {repositories.length > 0 && hasMore && !searchTerm && !filterLanguage && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading more...
              </>
            ) : (
              <>
                Load More Repositories
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

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