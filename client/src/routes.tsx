// import { createBrowserRouter } from 'react-router-dom';
// import Layout from './components/layout/Layout';
// import ErrorPage from './pages/ErrorPage';
// import HomePage from './pages/HomePage';
// import GamesList from './pages/GamesList';
// import { Gamepad2, Flame, Clock, BarChart, Trophy, Calendar } from 'lucide-react';
// import LoginPage from './pages/LoginPage';
// import SignUpPage from './pages/SignUpPage';
// import GameDetailsWrapper from './components/GameDetailsWrapper';

// // Create route configuration
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: "login", element: <LoginPage /> },
//       { path: "signup", element: <SignUpPage /> },
//       { path: "game/:id", element: <GameDetailsWrapper />},
      
//       // Discover section routes
//       { 
//         path: "trending", 
//         element: <GamesList 
//           title="Trending Games"
//           icon={Flame}
//           queryKey="trending"
//           queryParams={{
//             ordering: '-metacritic',
//             metacritic: '80,100',
//             page_size: 21
//           }}
//         />
//       },
//       { 
//         path: "new-releases", 
//         element: <GamesList 
//           title="New Releases"
//           icon={Clock}
//           queryKey="newReleases"
//           queryParams={{
//             dates: `${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]},${new Date().toISOString().split('T')[0]}`,
//             ordering: '-released',
//             page_size: 21
//           }}
//         />
//       },
//       { 
//         path: "top-rated", 
//         element: <GamesList 
//           title="Top Rated Games"
//           icon={BarChart}
//           queryKey="topRated"
//           queryParams={{
//             ordering: '-rating',
//             page_size: 21
//           }}
//         />
//       },
//       { 
//         path: "popular", 
//         element: <GamesList 
//           title="Popular Games"
//           icon={Trophy}
//           queryKey="popular"
//           queryParams={{
//             ordering: '-added',
//             page_size: 21
//           }}
//         />
//       },
//       { 
//         path: "games", 
//         element: <GamesList 
//           title="All Games"
//           icon={Gamepad2}
//           queryKey="allGames"
//           queryParams={{
//             ordering: '-rating',
//             page_size: 21
//           }}
//         />
//       },
//       { 
//         path: "upcoming", 
//         element: <GamesList 
//           title="Upcoming Games"
//           icon={Calendar}
//           queryKey="upcoming"
//           queryParams={{
//             dates: `${new Date().toISOString().split('T')[0]},${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
//             ordering: 'released',
//             page_size: 21
//           }}
//         />
//       },

//       // Category routes
//       { 
//         path: "category/:category", 
//         element: <GamesList 
//           title="Games by Category"
//           icon={Gamepad2}
//           queryKey="categoryGames"
//           queryParams={{
//             genres: '', // This will be set dynamically based on the route parameter
//             page_size: 21
//           }}
//         />
//       }
//     ],
//   },
// ]);

// export default router;