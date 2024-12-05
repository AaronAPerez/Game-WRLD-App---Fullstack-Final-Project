import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./hooks/useAuth";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import GamesList from "./pages/GamesList";
import GameDetailsWrapper from "./components/GameDetailsWrapper";
import { Gamepad2, Flame, Clock, BarChart, Trophy, Calendar } from 'lucide-react';

// Create a new instance of query client
const queryClient = new QueryClient();

// Create router with auth-wrapped routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider><Layout /></AuthProvider>} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="game/:id" element={<GameDetailsWrapper />} />

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
      {/* game list routes */}

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