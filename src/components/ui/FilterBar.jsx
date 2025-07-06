const FilterBar = ({ 
  sortBy, 
  onSortChange, 
  filterLanguage, 
  onLanguageChange, 
  availableLanguages, 
  filteredCount
}) => {
  const sortOptions = [
    { value: 'updated', label: 'Last Updated' },
    { value: 'name', label: 'Name' },
    { value: 'stars', label: 'Stars' },
    { value: 'forks', label: 'Forks' },
    { value: 'created', label: 'Created' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-semibold text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-md transition-all duration-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-semibold text-gray-700">Language:</label>
          <select
            value={filterLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-md transition-all duration-200"
          >
            <option value="">All Languages</option>
            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-gray-100/60 px-3 py-1 rounded-lg">
        Showing {filteredCount} repositories
      </div>
    </div>
  );
};

export default FilterBar; 