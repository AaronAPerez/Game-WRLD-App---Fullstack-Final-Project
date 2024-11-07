import { createBrowserRouter } from 'react-router-dom';
import Layout from './hooks/Layout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';


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
        element: <SignupPage/>
      },
    ],
  },
]);

export default router;