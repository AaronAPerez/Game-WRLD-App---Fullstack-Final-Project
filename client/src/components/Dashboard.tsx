import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import FilterBar from './FilterBar';
import GameGrid from './GameGrid';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  // Add welcome message for first-time users (can be enhanced with backend integration)
  const [showWelcome, setShowWelcome] = React.useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Welcome Banner */}
        {showWelcome && isAuthenticated && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Welcome to GameHub!</h2>
                <p className="text-gray-200">
                  Discover your next favorite game and connect with other gamers.
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <FilterBar />
            <GameGrid />
          </Suspense>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Dashboard;