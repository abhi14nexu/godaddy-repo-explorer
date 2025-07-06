import { Link } from 'react-router-dom';

const RepositoryCard = ({ repository }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link
      to={`/repository/${repository.name}`}
      className="card p-6 group relative overflow-hidden"
    >
      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
            {repository.name}
          </h3>
          {repository.isPrivate && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 shadow-sm">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Private
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {repository.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {repository.language && (
              <span className="flex items-center text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-full">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2"></div>
                {repository.language}
              </span>
            )}
            <span className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors duration-200">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {repository.stargazersCount}
            </span>
            <span className="flex items-center text-gray-600 hover:text-green-500 transition-colors duration-200">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              {repository.forksCount}
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100/60 px-2 py-1 rounded-md">
            {formatDate(repository.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RepositoryCard; 