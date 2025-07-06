import { useParams } from 'react-router-dom';
import { useRepository } from '../../../hooks/useRepository';
import { Breadcrumb, Loading, Error } from '../../ui';
import RepositoryStats from './RepositoryStats';

const RepositoryDetail = () => {
  const { repoName } = useParams();
  const { repository, languageStats, loading, error, refetch } = useRepository(repoName);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <Loading message="Loading repository details..." />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  if (!repository) {
    return <Error message="Repository not found" />;
  }

  const breadcrumbItems = [
    { label: 'Repositories', href: '/' },
    { label: repository.name }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Repository Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{repository.name}</h1>
            <p className="text-gray-600 text-lg">{repository.description || 'No description available'}</p>
          </div>
          <div className="flex items-center space-x-2">
            {repository.isPrivate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Private
              </span>
            )}
            {repository.isArchived && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Archived
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {repository.stargazersCount} stars
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            {repository.forksCount} forks
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {repository.watchersCount} watchers
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {repository.openIssuesCount} open issues
          </span>
        </div>
      </div>

      {/* Repository Stats Cards */}
      <div className="mb-8">
        <RepositoryStats repository={repository} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Repository Details</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDate(repository.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{formatDate(repository.updatedAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Push</dt>
                <dd className="text-sm text-gray-900">{formatDate(repository.pushedAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Size</dt>
                <dd className="text-sm text-gray-900">{formatFileSize(repository.size * 1024)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Default Branch</dt>
                <dd className="text-sm text-gray-900">{repository.defaultBranch}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">License</dt>
                <dd className="text-sm text-gray-900">{repository.license || 'No license'}</dd>
              </div>
            </dl>
          </div>

          {/* Topics */}
          {repository.topics && repository.topics.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {repository.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Languages */}
          {languageStats.length > 0 && (
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Languages</h2>
              <div className="space-y-3">
                {languageStats.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700">{lang.language}</span>
                    </div>
                    <span className="text-sm text-gray-500">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href={repository.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-center transition-colors"
              >
                View on GitHub
              </a>
              <a
                href={`${repository.htmlUrl}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md text-center transition-colors"
              >
                View Issues
              </a>
              <a
                href={`${repository.htmlUrl}/network/members`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md text-center transition-colors"
              >
                View Forks
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryDetail; 