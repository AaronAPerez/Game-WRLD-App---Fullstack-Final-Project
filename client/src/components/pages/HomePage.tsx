import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Star } from 'lucide-react';
import { useGames } from '../../hooks/useGames';
import FeaturedGames from '../FeaturedGames';



const HomePage = () => {
  const navigate = useNavigate();
  useGames({
    initialFilters: {
      ordering: '-rating',
      page_size: 4,
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black opacity-90" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Your Gaming Universe
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover, track, and connect with your favorite games and fellow gamers
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/games')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg
                    hover:bg-purple-700 transition-colors"
                >
                  Browse Games
                </button>
                <button
                  onClick={() => navigate('/auth/signup')}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg
                    hover:bg-gray-700 transition-colors"
                >
                  Join Community
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-800 rounded-xl"
            >
              <Gamepad2 className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Track Your Games</h3>
              <p className="text-gray-400">Keep track of your gaming library and progress</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gray-800 rounded-xl"
            >
              <Users className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Connect with Gamers</h3>
              <p className="text-gray-400">Join a community of passionate gamers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gray-800 rounded-xl"
            >
              <Star className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Rate & Review</h3>
              <p className="text-gray-400">Share your gaming experiences with others</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Games */}
      <div className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Games</h2>
          <FeaturedGames />
        </div>
      </div>

      {/* Community Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                src="/community.jpg"
                alt="Gaming Community"
                className="rounded-xl shadow-2xl"
              />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-white">Join Our Community</h2>
              <p className="text-gray-400">
                Connect with fellow gamers, share your achievements, and stay up to date
                with the latest gaming trends.
              </p>
              <button
                onClick={() => navigate('/auth/signup')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg
                  hover:bg-purple-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Gamepad, Calendar, TrendingUp, 
//   ChevronRight, 
// } from 'lucide-react';
// import { gameService } from '../services/gameService';
// import type { Game } from '../types/rawg';
// import FeaturedGames from '../components/game/FeaturedGames';
// import { GameDetailsModal } from '../components/game/GameDetailsModal';
// import { GameCard } from '../components/game/GameCard';


// export default function  HomePage() {
//   const [selectedGame, setSelectedGame] = useState(null);


//   // Fetch New Releases (last 30 days)
//   const { data: newReleases } = useQuery({
//     queryKey: ['newReleases'],
//     queryFn: () => {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
//       return gameService.getGames({
//         dates: `${thirtyDaysAgo.toISOString().split('T')[0]},${new Date().toISOString().split('T')[0]}`,
//         ordering: '-released',
//         page_size: 6
//       });
//     }
//   });

//   // Fetch Upcoming Games (next 6 months)
//   const { data: upcomingGames } = useQuery({
//     queryKey: ['upcomingGames'],
//     queryFn: () => {
//       const sixMonthsLater = new Date();
//       sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      
//       return gameService.getGames({
//         dates: `${new Date().toISOString().split('T')[0]},${sixMonthsLater.toISOString().split('T')[0]}`,
//         ordering: 'released',
//         page_size: 6
//       });
//     }
//   });

//   // Fetch Trending Games (high metacritic)
//   const { data: trendingGames } = useQuery({
//     queryKey: ['trendingGames'],
//     queryFn: () => gameService.getGames({
//       ordering: '-metacritic',
//       metacritic: '80,100',
//       page_size: 6
//     })
//   });

//   return (
//     <div className="min-h-screen space-y-12">
//       {/* Hero Section */}
//       <FeaturedGames/>


//       {/* Game Categories */}
//       <div className="container mx-auto px-2 space-y-12">
//         {/* New Releases */}
//         {/* <GameSection
//           title="New Releases"
//           icon={Calendar}
//           games={newReleases?.results || []}
//           onGameSelect={setSelectedGame}
//         /> */}

//         {/* Upcoming Games */}
//         <GameSection
//           title="Upcoming Games"
//           icon={Gamepad}
//           games={upcomingGames?.results || []}
//           onGameSelect={setSelectedGame}
//         />

//         {/* Trending Now */}
//         <GameSection
//           title="Trending Now"
//           icon={TrendingUp}
//           games={trendingGames?.results || []}
//           onGameSelect={setSelectedGame}
//         />
//       </div>

//       {/* Game Details Modal */}
//       <AnimatePresence>
//         {selectedGame && (
//           <GameDetailsModal
//             gameId={selectedGame.id}
//             onClose={() => setSelectedGame(null)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // Game Section Component
// interface GameSectionProps {
//   title: string;
//   icon: React.FC<{ className?: string }>;
//   games: Game[];
//   onGameSelect: (game: Game) => void;
// }

// function GameSection({ title, icon: Icon, games, onGameSelect }: GameSectionProps) {
//   return (
//     <section className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Icon className="w-6 h-6 text-app-accent-primary" />
//           <h2 className="text-2xl font-bold">{title}</h2>
//         </div>
        
//         <button className="text-app-accent-primary hover:text-app-accent-primary/80 
//                         flex items-center gap-1">
//           View All
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>
//     {/* Games Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {games.map((game) => (
//           <motion.div
//             key={game.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <GameCard
//               game={game} 
//               onClick={() => 
//               onGameSelect(game)}
//               rank={0} />
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }
