// src/components/search/SearchResults.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { Game } from '../../types/game';

interface SearchResultsProps {
  results: Game[];
  isVisible: boolean;
  isSearching: boolean;
  onSelect: (game: Game) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isVisible,
  isSearching,
  onSelect,
}) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl 
          border border-gray-700 overflow-hidden z-50"
      >
        {isSearching ? (
          <div className="p-4 text-center">
            <div className="inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent 
              rounded-full animate-spin"
            />
          </div>
        ) : results.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.map((game) => (
              <button
                key={game.id}
                onClick={() => onSelect(game)}
                className="w-full px-4 py-3 flex gap-4 hover:bg-gray-700/50 transition-colors"
              >
                {/* Game Image */}
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Game Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-white mb-1">{game.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {game.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(game.released).getFullYear()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400">
            No results found
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};