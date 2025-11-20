import { Link } from 'react-router-dom';

const Error = ({ message, onRetry, isAuthError }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-4">
      <span className="block sm:inline">{message || 'An error occurred'}</span>
      <div className="mt-3 flex gap-2">
        {isAuthError ? (
          <Link
            to="/login"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Login
          </Link>
        ) : (
          onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Error;

