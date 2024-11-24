import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignUpPage';
import ArcadePage from './pages/ArcadePage';
import LoginPage from './pages/LoginPage';
import GamesGrid from './components/GamesGrid';





const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, element: <HomePage />
      },
  
      { 
        path: "games",
        element: <GamesGrid />
      },
      // { 
      //   path: "timeline",
      //   element: <Timeline />
      // },
      { 
        path: "login",
        element: <LoginPage />
      },
      { 
        path: "signup",
        element: <SignupPage/>
      },
      // { 
      //   path: "dashboard",
      //   element: <Dashboard />
      // },
    ],
  },
]);

export default router;