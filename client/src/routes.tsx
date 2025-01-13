import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import ErrorPage from './components/pages/ErrorPage';
import HomePage from './components/pages/HomePage';
import GameDetails from './components/GameDetails';
import SignUpPage from './components/pages/auth/SignUpPage';
import ProtectedRoute from './components/pages/auth/ProtectedRoute';

import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import SocialFeed from './components/SocialFeed';
import LoginPage from './components/pages/auth/LoginPage';
import Dashboard from './components/Dashboard';
import Layout from './components/layouts/Layout';
import BlogPage from './components/pages/BlogPage';
import FilteredGamesGrid from './components/games/FilteredGamesGrid';
import MediaGallery from './components/media/MediaGallery';
import { MediaGallerySection } from './components/games/MediaGallerySection';
import GameCarousel from './components/GameCarousel';
import FeaturedGames from './components/FeaturedGames';
import GameGrid from './components/GameGrid';



const routes = [
  {
    path: "/",
    element: <AuthProvider><Layout /></AuthProvider>,
    errorElement: <ErrorPage />,
    children: [
      // Public Routes
      {
        index: true,
        element: <GameGrid/> 
      },
      {
        path: "games",
        children: [
          {
            index: true,
            element: <FilteredGamesGrid />
          },
          {
            path: ":id",
            element: <GameDetails gameId={0} />
          }
        ]
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <LoginPage />
          },
          {
            path: "signup",
            element: <SignUpPage />
          }
        ]
      },

      // Protected Routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "blog",
        children: [
          {
            path: "create",
            element: (
              <ProtectedRoute>
                <BlogPage />
              </ProtectedRoute>
            )
          },
          {
            path: "edit/:blogId",
            element: (
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            )
          },
          {
            path: ":postId",
            element: <PostCard post={undefined} />
          },
          {
            path: "dashboard",
            element: (
              <ProtectedRoute>
                <SocialFeed />
              </ProtectedRoute>
            )
          }
        ]
      },

      // Fallback route
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;