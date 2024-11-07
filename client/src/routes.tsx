import { createBrowserRouter } from 'react-router-dom';
import Layout from './routing/Layout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import FriendsPage from './components/friends/FriendsPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true,
        element: <HomePage />
      },
      { 
        path: "login",
        element: <LoginPage />
      },
      { 
        path: "signup",
        element: <SignUpPage />
      },
      { 
        path: "chat",
        element: <ChatPage />
      },
      {
        path: "friends",
        element: <FriendsPage />
      },
    ],
  },
]);

export default router;