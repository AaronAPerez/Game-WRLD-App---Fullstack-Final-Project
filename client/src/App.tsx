import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layouts/Layout';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/auth/LoginPage';
import SignUpPage from './components/pages/auth/SignUpPage';
import UserProfile from './components/social/UserProfile';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GameDetails from './components/GameDetails';
import GameGrid from './components/GameGrid';
import BlogPage from './components/pages/BlogPage';
import GamingLayout from './components/layouts/GamingLayout';
import { Toaster } from 'react-hot-toast';


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
          <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Main Routes */}
                <Route index element={<GameGrid />} />
                <Route path="games" element={<GamingLayout />} />
                <Route path="games/:id" element={<GameDetails gameId={0} />} />
                <Route path="blog" element={<BlogPage />} />
                {/* <Route path="trending" element={<TrendingPage />} />
                <Route path="new-releases" element={<NewReleasesPage />} />
                <Route path="top-rated" element={<TopRatedPage />} /> */}
                
                {/* Social Routes */}
                {/* <Route path="messages" element={<MessagesPage />} />
                <Route path="friends" element={<FriendsPage />} /> */}
                {/* <Route path="blog" element={<BlogPage />} />
                <Route path="profile/:userId" element={<UserProfile />} /> */}

                {/* Auth Routes */}
                <Route path="auth">
                  <Route path="login" element={<LoginPage />} />
                  <Route path="signup" element={<SignUpPage />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute children={undefined} />}>
                  {/* <Route path="settings" element={<SettingsPage />} /> */}
                     {/* <Route path="messages" element={<MessagesPage />} />
                <Route path="friends" element={<FriendsPage />} /> */}
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}