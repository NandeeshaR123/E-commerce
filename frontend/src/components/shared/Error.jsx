const Error = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-4">
      <span className="block sm:inline">{message || 'An error occurred'}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default Error;

