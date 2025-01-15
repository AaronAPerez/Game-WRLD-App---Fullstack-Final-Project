import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import { GameDetailsModal } from './GameDetailsModal';
import { cn } from '../utils/styles';
import { Game } from '../types/game';

import Highlight from './Highlight';
import { HeroHighlight } from './HeroHighlight';
import gameService from '@/services/gameService';


interface FeaturedGamesResponse {
  results: Game[];
}

const FeaturedGames = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [direction, setDirection] = useState(0);

  const { data: featured, isLoading } = useQuery<FeaturedGamesResponse>({
    queryKey: ['featuredGames'],
    queryFn: () => gameService.getGames({
      dates: `2023-01-01,${new Date().toISOString().split('T')[0]}`,
      ordering: '-metacritic',
      page_size: 5
    })
  });

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => 
      prev === (featured?.results.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => 
      prev === 0 ? (featured?.results.length || 1) - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] bg-stone-900 animate-pulse rounded-lg">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!featured?.results.length) return null;

  const currentGame = featured.results[currentIndex];

  return (
    <div className="relative h-[70vh] group">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentGame.id}
          custom={direction}
          initial={{ x: 300 * direction, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300 * direction, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          {/* Background Image with Gradient */}
          <div className="relative h-full">
            <img
              src={currentGame.background_image}
              alt={currentGame.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          {/* Hero Text Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <HeroHighlight className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: [20, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-center px-4 space-y-4"
              >
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-relaxed">
                  Discover{" "}
                  <Highlight className="text-white">
                    {currentGame.name}
                  </Highlight>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                  {currentGame.genres?.map(genre => genre.name).join(' • ')}
                </p>
              </motion.div>
            </HeroHighlight>

            {/* Game Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {currentGame.metacritic && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
                  <span className="text-green-400 font-medium">
                    {currentGame.metacritic} Metacritic
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">
                  {currentGame.rating}/5
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <Calendar className="w-5 h-5 text-white" />
                <span className="text-white font-medium">
                  {new Date(currentGame.released).getFullYear()}
                </span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setSelectedGame(currentGame)}
              className="mt-8 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full
                         transform transition-all hover:scale-105"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
        <button
          onClick={handlePrev}
          className={cn(
            "p-3 rounded-full bg-black/50 backdrop-blur-sm text-white",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-white/20 transform hover:scale-110"
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className={cn(
            "p-3 rounded-full bg-black/50 backdrop-blur-sm text-white",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-white/20 transform hover:scale-110"
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.results.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={cn(
              "w-16 h-1 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-indigo-500 scale-110" 
                : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>

      {/* Game Details Modal */}
      <AnimatePresence>
        {selectedGame && (
          <GameDetailsModal
            gameId={selectedGame.id}
            onClose={() => setSelectedGame(null)}
          />
        )}
      </AnimatePresence>
    </div>
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