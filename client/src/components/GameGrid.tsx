import React from "react";
import { motion } from "framer-motion";
import { useFilteredGames } from "../hooks/useFilteredGames";
import GameCard from "./games/GameCard";
import FilterBar from "./FilterBar";
import { Loader2 } from "lucide-react";

const GameGrid = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredGames();

  // Safely extract games from data
  const games = data?.pages?.flatMap(page => page.results) ?? [];

  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-700/50">
      <FilterBar />
      
      <div className="container mx-auto px-4 py-8 w-min-580">
        {error ? (
          <div className="text-red-500 text-center p-8">
            Error loading games: {error.toString()}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-between">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            <p className="mt-4 text-gray-400">Loading awesome games...</p>
          </div>
        ) : games.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {games.map((game, index) => (
              <motion.div
                key={`${game.id}-${index}`}
                variants={itemVariants}
                layout
              >
                <GameCard 
                  game={game} 
                  priority={index < 4}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No games found. Try adjusting your filters.
            </p>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="h-20" />
        
        {/* Load more indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center mt-8">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameGrid;