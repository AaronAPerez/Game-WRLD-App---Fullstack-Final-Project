import { useQuery } from '@tanstack/react-query';
import { Game } from '../types/rawg';
import { gameService } from '../services/gameService';
import GameCarousel from './game/GameCarousel';
import { useState } from 'react';
import { GameDetailsModal } from './GameDetailsModal';
import { AnimatePresence } from 'framer-motion';

interface FeaturedGamesResponse {
  results: Game[];
}

const FeaturedGames = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const { data: featured, isLoading } = useQuery<FeaturedGamesResponse>({
    queryKey: ['featuredGames'],
    queryFn: () => gameService.getGames({
      dates: `2023-01-01,${new Date().toISOString().split('T')[0]}`,
      ordering: '-metacritic',
      page_size: 5
    })
  });

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-stone-900 animate-pulse rounded-lg">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!featured?.results.length) return null;

  return (
    <>
      <GameCarousel 
        games={featured.results} 
        onGameSelect={setSelectedGame} 
      />
      
      <AnimatePresence>
        {selectedGame && (
          <GameDetailsModal
            gameId={selectedGame.id}
            onClose={() => setSelectedGame(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FeaturedGames;
// import { useQuery } from '@tanstack/react-query';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Calendar, ChevronLeft, ChevronRight, Star } from 'lucide-react';
// import { useState } from 'react';
// import { Game } from '../types/rawg';
// import { gameService, getMetacriticColor } from '../services/gameService';
// import { cn } from '../utils/styles';

// // Response type array from the API
// interface FeaturedGamesResponse {
//   results: Game[];
// }

// const FeaturedGames = () => {
//   // useState to track the current displayed game index
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Fetch featured games data using React Query
//   const { data: featured, isLoading } = useQuery<FeaturedGamesResponse>({
//     queryKey: ['featuredGames'],
//     queryFn: () => gameService.getGames({
//       // Get games from 2023 to current date
//       dates: `2023-01-01,${new Date().toISOString().split('T')[0]}`,
//       ordering: '-metacritic', // Sort by metacritic score descending
//       page_size: 5 // Limit to 5 games
//     })
//   });

//   const nextSlide = () => {
//     if (featured?.results) {
//       setCurrentIndex((current) =>
//         current === featured.results.length - 1 ? 0 : current + 1
//       );
//     }
//   };

//   const prevSlide = () => {
//     if (featured?.results) {
//       setCurrentIndex((current) =>
//         current === 0 ? featured.results.length - 1 : current - 1
//       );
//     }
//   };


//   // Display Loading skeleton while data is being fetched
//   if (isLoading) {
//     return (
//       <div className="w-full aspect-video bg-stone-900 animate-pulse rounded-lg">
//         <div className="h-full w-full flex items-center justify-center">
//           <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   // Guard clause if no games are found
//   if (!featured?.results.length) return null;


//   // Carousel w/ featured games
//   const currentGame = featured.results[currentIndex];

//   return (
//     <div className="relative group">
//       {/* Section Title Overlay */}
//       <div className="absolute top-0 left-0 z-20 p-6 bg-gradient-to-r from-stone-950 to-transparent">
//         <h2 className="text-3xl font-bold text-white">Featured Games</h2>
//       </div>
//       {/* AnimatePresence enables exit animations */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={currentGame.id}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="relative aspect-video rounded-lg overflow-hidden"
//         >
//           {/* Game Background Image */}
//           <img
//             src={currentGame.background_image}
//             alt={currentGame.name}
//             className="w-full h-full object-cover"
//           />
//           {/* Gradient overlay for better text readability */}
//           <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
//         <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
//           <div className="space-y-4">
//             <h1 className="text-5xl font-bold">{currentGame.name}</h1>
//             <div className="flex items-center gap-6">
//               {currentGame.metacritic && (
//                 <div className={cn(
//                   "px-3 py-1 rounded-full font-medium",
//                   getMetacriticColor(currentGame.metacritic)
//                 )}>
//                   Metacritic: {currentGame.metacritic}
//                 </div>
//               )}
//               <div className="flex items-center gap-2">
//                 <Star className="w-5 h-5 text-yellow-500" />
//                 <span>{currentGame.rating}/5</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-5 h-5" />
//                 <span>{new Date(currentGame.released).getFullYear()}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//           {/* Game Information Overlay */}
//           <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
//             <motion.h2
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="text-3xl font-bold mb-4"
//             >            
//               {currentGame.name}
//             </motion.h2>
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.1 }}
//               className="flex gap-4 items-center"
//             >
//               {/* Metacritic Score Badge */}
//               {currentGame.metacritic && (
//                 <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
//                   {currentGame.metacritic}
//                 </span>
//               )}
//               <div className="flex gap-2">
//                 {currentGame.genres?.slice(0, 3).map(genre => (
//                   <span key={genre.id} className="text-sm text-gray-300">
//                     {genre.name}
//                   </span>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </AnimatePresence>


//       {/* Navigation Arrows */}
//       <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
//         <button
//           onClick={prevSlide}
//           className={cn(
//             "p-2 rounded-full bg-black/50 backdrop-blur-sm text-white",
//             "hover:bg-indigo-500/50 transition-colors",
//             "opacity-0 group-hover:opacity-100 transition-opacity"
//           )}
//           aria-label="Previous game"
//         >
//           <ChevronLeft className="w-6 h-6" />
//         </button>
//         <button
//           onClick={nextSlide}
//           className={cn(
//             "p-2 rounded-full bg-black/50 backdrop-blur-sm text-white",
//             "hover:bg-indigo-500/50 transition-colors",
//             "opacity-0 group-hover:opacity-100 transition-opacity"
//           )}
//           aria-label="Next game"
//         >
//           <ChevronRight className="w-6 h-6" />
//         </button>
//       </div>

//       {/* Navigation Dots */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//         {featured.results.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={cn(
//               "w-2 h-2 rounded-full transition-colors",
//               index === currentIndex ? "bg-white" : "bg-white/50"
//             )}
//             aria-label={`Go to game ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FeaturedGames;