import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFilteredGames } from '../../hooks/useFilteredGames';

import { Loader2 } from 'lucide-react';
import FilterBar from '../FilterBar';
import GameCard from './GameCard';

const FilteredGamesGrid = () => {
  const {
    games,
    totalCount,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFilteredGames();

  const intObserver = useRef<IntersectionObserver | null>(null);
  const lastGameRef = useCallback((game: HTMLDivElement) => {
    if (isFetchingNextPage) return;

    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (game) intObserver.current.observe(game);
  }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <FilterBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            Error loading games. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <FilterBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {totalCount.toLocaleString()} Games Found
            </h2>
          </div>
        )}

        {/* Games Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {games.map((game, ) => {
            if (games.length === i + 1) {
              return (
                <motion.div
                  key={game.id}
                  ref={lastGameRef}
                  variants={itemVariants}
                >
                  <GameCard game={game} />
                </motion.div>
              );
            }
            return (
              <motion.div
                key={game.id}
                variants={itemVariants}
              >
                <GameCard game={game} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Loading States */}
        {(isLoading || isFetchingNextPage) && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}

        {/* No Results */}
        {!isLoading && games.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No games found</h3>
            <p className="text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilteredGamesGrid;