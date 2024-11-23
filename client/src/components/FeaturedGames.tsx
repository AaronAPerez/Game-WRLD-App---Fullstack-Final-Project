import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Game } from '../types/rawg';
import { gameService } from '../services/gameService';

// Response type array from the API
interface FeaturedGamesResponse {
  results: Game[];
}

const FeaturedGames = () => {
  // useState to track the current displayed game index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch featured games data using React Query
  const { data: featured, isLoading } = useQuery<FeaturedGamesResponse>({
    queryKey: ['featuredGames'],
    queryFn: () => gameService.getGames({
      // Get games from 2023 to current date
      dates: `2023-01-01,${new Date().toISOString().split('T')[0]}`,
      ordering: '-metacritic', // Sort by metacritic score descending
      page_size: 5 // Limit to 5 games
    })
  });

  // Display Loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-stone-900 animate-pulse rounded-lg">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Guard clause if no games are found
  if (!featured?.results.length) return null;


// Carousel w/ featured games
  const currentGame = featured.results[currentIndex];

  return (
    <div className="relative group">
      {/* AnimatePresence enables exit animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative aspect-video rounded-lg overflow-hidden"
        >
          {/* Game Background Image */}
          <img
            src={currentGame.background_image}
            alt={currentGame.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
          
          {/* Game Information Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-2"
            >
              {currentGame.name}
            </motion.h2>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4 items-center"
            >
              {/* Metacritic Score Badge */}
              {currentGame.metacritic && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  {currentGame.metacritic}
                </span>
              )}
              {/* Game Genres */}
              <div className="flex gap-2">
                {currentGame.genres?.slice(0, 3).map(genre => (
                  <span key={genre.id} className="text-sm text-gray-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>


      {/* Navigation Arrows - Only visible on hover */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentIndex(current => 
            current === 0 ? featured.results.length - 1 : current - 1
          )}
          className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
          aria-label="Previous game"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentIndex(current => 
            current === featured.results.length - 1 ? 0 : current + 1
          )}
          className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
          aria-label="Next game"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/*Navigation Dots*/}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.results.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to game ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedGames;