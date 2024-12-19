import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import GameDetailsWrapper from './components/GameDetailsWrapper';
import Dashboard from './pages/Dashboard';
import BlogPage from './pages/BlogPage';
import { UserSearch } from './components/UserSearch/UserSearch';
import GamesList from './pages/GamesList';
import { Gamepad2, Flame, Clock, BarChart, Calendar } from 'lucide-react';
import ChatComponent from './components/chat/ChatComponent';
import Messages from './components/chat/Messages';
import FriendsPage from './pages/FriendsPage';
import ChatRoom from './components/chat/ChatRoom';


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />} errorElement={<ErrorPage />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="game/:id" element={<GameDetailsWrapper />} />

        {/* Game Discovery Routes */}
        <Route path="trending" element={
          <GamesList
            title="Trending Games"
            icon={Flame}
            queryKey="trending"
            queryParams={{
              ordering: '-metacritic',
              metacritic: '80,100',
              page_size: 21
            }}
          />
        } />
        <Route path="new-releases" element={
          <GamesList 
            title="New Releases"
            icon={Clock}
            queryKey="new-releases"
            queryParams={{
              ordering: '-released',
              dates: '2024-01-01,2024-12-31',
              page_size: 21
            }}
          />
        } />
        <Route path="top-rated" element={
          <GamesList 
            title="Top Rated Games"
            icon={BarChart}
            queryKey="top-rated"
            queryParams={{
              ordering: '-rating',
              page_size: 21
            }}
          />
        } />
        <Route path="upcoming" element={
          <GamesList 
            title="Upcoming Games"
            icon={Calendar}
            queryKey="upcoming"
            queryParams={{
              dates: '2024-04-01,2024-12-31',
              ordering: 'released',
              page_size: 21
            }}
          />
        } />
        <Route path="games" element={
          <GamesList 
            title="All Games"
            icon={Gamepad2}
            queryKey="all-games"
            queryParams={{
              ordering: '-rating',
              page_size: 21
            }}
          />
        } />

        {/* Protected Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="blog" element={
          <ProtectedRoute>
            <BlogPage />
          </ProtectedRoute>
        } />
        <Route path="search" element={
          <ProtectedRoute>
            <UserSearch />
          </ProtectedRoute>
        } />
        <Route path="friends" element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        } />
        {/* <Route path="chat" element={
          <ProtectedRoute>
            
          </ProtectedRoute>
        } /> */}
        <Route path="messages/:userId?" element={
          <ProtectedRoute>
            <Messages/>
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;