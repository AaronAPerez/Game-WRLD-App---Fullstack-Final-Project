import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layouts/Layout';
import HomePage from './components/pages/HomePage';
import GamesPage from './components/pages/GamesPage';
import GameDetails from './components/GameDetails';
import GameGrid from './components/GameGrid';
import { Settings } from 'lucide-react';
import LoginPage from './components/pages/auth/LoginPage';
import CommunityFeed from './components/social/CommunityFeed';
import UserProfile from './components/social/UserProfile';
import SignUpPage from './components/pages/auth/SignUpPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  }
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<GameGrid />} />
                <Route path="games">
                  <Route index element={<GamesPage />} />
                  <Route path=":id" element={<GameDetails gameId={0} />} />
                </Route>
                <Route path="browse" element={<GameGrid />} />

                {/* Social Routes */}
                <Route path="social">
                  <Route index element={<CommunityFeed />} />
                  <Route path="profile/:userId" element={<UserProfile />} />
                </Route>

                {/* Auth Routes */}
                <Route path="auth">
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<SignUpPage />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute>
                  <Route path="settings" element={<Settings />} />
                </ProtectedRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
