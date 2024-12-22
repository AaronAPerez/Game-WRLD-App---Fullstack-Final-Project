import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import Layout from "./components/layout/Layout";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import GamesList from "./pages/GamesList";
import GameDetailsWrapper from "./components/GameDetailsWrapper";
import Dashboard from "./pages/Dashboard";
import BlogPage from "./pages/BlogPage";
import FriendsList from "./components/FriendList";
import ChatRoom from "./components/chat/ChatRoom";
import { Gamepad2, Flame, Clock, BarChart, Calendar } from 'lucide-react';
import Messages from "./components/chat/Messages";
import { UserSearch } from "./components/UserSearch/UserSearch";


// Create a new instance of query client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Create router with auth-wrapped routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider><Layout /></AuthProvider>} errorElement={<ErrorPage />}>
      {/* Public Routes */}
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="game/:id" element={<GameDetailsWrapper />} />
      <Route path="/messages/:userId?" element={<Messages />} />

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

      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <UserSearch />
          </ProtectedRoute>
        } 
      />
      
      <Route path="friends" element={
        <ProtectedRoute>
          <FriendsList />
        </ProtectedRoute>
      } />
           {/* Protected Chat Routes */}
           <Route path="chat" element={
        <ProtectedRoute>
          <ChatRoom />
        </ProtectedRoute>
      } />
      <Route path="messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
    </Route>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;