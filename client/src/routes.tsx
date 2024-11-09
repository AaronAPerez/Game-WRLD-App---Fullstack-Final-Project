import { createBrowserRouter } from 'react-router-dom';
import Layout from './hooks/Layout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import GamesPage from './pages/GamesPage';
import ArcadePage from './pages/ArcadePage';


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
        path: "arcade",
        element: <ArcadePage />
      },
      { 
        path: "login",
        element: <LoginPage />
      },
      { 
        path: "games",
        element: <GamesPage />
      },
      { 
        path: "login",
        element: <LoginPage />
      },
      { 
        path: "signup",
        element: <SignupPage/>
      },
    ],
  },
]);

export default router;