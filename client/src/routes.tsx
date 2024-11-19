import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorPage from './pages/ErrorPage';
// import HomePage from './pages/HomePage';
import SignupPage from './pages/SignUpPage';
import ArcadePage from './pages/ArcadePage';
import Games from './pages/Games';
import Timeline from './pages/Timeline';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Dashboard  from './pages/Dashboard';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, element: <LandingPage />
      },
      
      // { 
      //   index: true,
      //   element: <HomePage />
      // },
      {
        path: "arcade",
        element: <ArcadePage />
      },
      { 
        path: "games",
        element: <Games />
      },
      { 
        path: "timeline",
        element: <Timeline />
      },
      { 
        path: "login",
        element: <LoginPage />
      },
      { 
        path: "signup",
        element: <SignupPage/>
      },
      { 
        path: "dashboard",
        element: <Dashboard />
      },
    ],
  },
]);

export default router;