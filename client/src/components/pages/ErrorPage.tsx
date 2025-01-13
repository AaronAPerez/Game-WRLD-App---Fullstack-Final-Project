import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500">
          {error.statusText || error.message}
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;