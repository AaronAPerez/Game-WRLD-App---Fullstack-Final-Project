import { createBrowserRouter } from 'react-router-dom';
import Layout from './routing/Layout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';


const router = createBrowserRouter([
    {
      path: "/",
      element:  <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { 
          index: true,
          element: <HomePage />
        },
        // { 
        //   path: "arcade",
        //   element: <ArcadePage/>
        // },
        // { 
        //   path: "arcade",
        //   element: <ArcadePage/>
        // },
        // { 
        //   path: "signup",
        //   element: <SignupPage />
        // },
        // { 
        //   path: "login",
        //   element: <LoginPage />
        // },
  
        // { 
        //   path: "library",
        //   element: (
        //     // <PrivateRoute>
        //     //   {/* <LibraryPage /> */}
        //     // </PrivateRoute>
        //   )
        // },
      ],
    },
  
  ]);
  
  export default router;