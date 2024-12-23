import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import GameDetailsWrapper from './components/GameDetailsWrapper';
import Dashboard from './pages/Dashboard';
import BlogPage from './pages/BlogPage';
import { UserSearch } from './components/UserSearch/UserSearch';
import GamesList from './pages/GamesList';
import { Gamepad2, Flame, Clock, BarChart, Calendar, Layout } from 'lucide-react';
import FriendsPage from './pages/FriendsPage';
import GamingTimeline from './pages/GamingTimeline';
import { ChatRoom } from './pages/ChatRoom';


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
        <Route path="timeline" element={<GamingTimeline />} />

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
        {/* <Route path="new-releases" element={
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
        } /> */}
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
        <Route path="chat" element={
          <ProtectedRoute>
            <ChatRoom roomId={0}/>
          </ProtectedRoute> 
         } />   
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
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/useAuth';
// import Layout from './components/layout/Layout';
// import { lazy, Suspense } from 'react';
// import { UserSearch } from './components/search/UserSearch';
// import SignUpPage from './pages/SignUpPage';
// import Dashboard from './pages/Dashboard';
// import GamingTimeline from './pages/GamingTimeline';
// // import Messages from './components/message/Messages';


// // Lazy loaded components
// const Home = lazy(() => import('./pages/HomePage'));
// const Login = lazy(() => import('./pages/LoginPage'));
// const SignUp = lazy(() => import('./pages/SignUpPage'));
// // const Dashboard = lazy(() => import('./pages/Dashboard'));
// const Chat = lazy(() => import('./pages/ChatPage'));
// const Profile = lazy(() => import('./pages/Profile'));
// const Friends = lazy(() => import('./pages/FriendsPage'));

// // Protected Route Component
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="profile" replace />;
//   }

//   return children;
// };

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         {/* Public Routes */}
//         <Route path="/" element={
//           <Suspense fallback={<div>Loading...</div>}>
//             <Home />
//           </Suspense>
//         } />
//        <Route path="/" element={
//           <Suspense fallback={<div>Loading...</div>}> 
//             <GamingTimeline />
//            </Suspense> 
//          } />
//         <Route path="login" element={
//           <Suspense fallback={<div>Loading...</div>}>
//             <Login />
//           </Suspense>
//         } />
//         <Route path="signup" element={
//           <Suspense fallback={<div>Loading...</div>}>
//             <SignUpPage />
//           </Suspense>
//         } />

//         {/* Protected Routes */}
//         <Route path="dashboard" element={
//           <ProtectedRoute>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Dashboard />
//             </Suspense>
//           </ProtectedRoute>
//         } />
//         {/* Protected Routes */}
//         <Route path="chat" element={
//           <ProtectedRoute>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Chat />
//             </Suspense>
//           </ProtectedRoute>
//         } />
//         <Route path="profile" element={
//           <ProtectedRoute>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Profile />
//             </Suspense>
//             <Route path="search" element={
//           <ProtectedRoute>
//               <Suspense fallback={<div>Loading...</div>}>
//             <UserSearch />
//             </Suspense>
//           </ProtectedRoute>
//         } />
//           </ProtectedRoute>
//         } />
//         <Route path="friends" element={
//           <ProtectedRoute>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Friends />
//             </Suspense>
//                       </ProtectedRoute>
//         } />
//                 {/* <Route path="chat" element={
//           <ProtectedRoute>
            
//           </ProtectedRoute>
//         } /> */}
//         {/* <Route path="messages/:userId?" element={
//           <ProtectedRoute>
//             <Messages/>
//           </ProtectedRoute> */}
//         {/* } /> */}
//       </Route>
//     </Routes>
//   );
// }