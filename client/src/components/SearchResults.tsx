import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, X, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Game } from '../types/rawg';
import { gameService } from '../services/gameService';
import { cn } from '../utils/styles';

interface SearchResultsProps {
  query: string;
  onClose: () => void;
  isOpen: boolean;
}

// Function Declaration
export default function SearchResults({ query, onClose, isOpen }: SearchResultsProps) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['gameSearch', query],
    queryFn: () => gameService.getGames({ 
      search: query,
      page_size: 5,
      ordering: '-rating'
    }),
    enabled: query.length >= 2 && isOpen,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !data?.results.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < data.results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSelectGame(data.results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, data, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  const handleSelectGame = (game: Game) => {
    navigate(`/game/${game.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 mx-4 bg-stone-900 rounded-xl border border-stone-800 shadow-xl"
    >
      <div className="p-2">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center gap-2 p-8 text-red-400">
            <X className="w-5 h-5" />
            <span>Failed to load search results</span>
          </div>
        )}

        {/* No Results */}
        {!isLoading && data?.results.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
            <SearchIcon className="w-6 h-6" />
            <p>No games found for "{query}"</p>
          </div>
        )}

        {/* Results List */}
        {data?.results.length > 0 && (
          <div ref={resultsRef} className="divide-y divide-stone-800">
            {data.results.map((game, index) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.05 }
                }}
                onClick={() => handleSelectGame(game)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-lg transition-colors",
                  "hover:bg-stone-800",
                  selectedIndex === index ? "bg-stone-800" : ""
                )}
              >
                {/* Game Thumbnail */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <img 
                    src={game.background_image} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  {game.metacritic && (
                    <div className={cn(
                      "absolute bottom-0 right-0 px-1.5 py-0.5 text-xs font-medium rounded-tl-lg",
                      game.metacritic >= 75 ? "bg-green-500" :
                      game.metacritic >= 50 ? "bg-yellow-500" : "bg-red-500"
                    )}>
                      {game.metacritic}
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-medium text-white">
                    {game.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(game.released).getFullYear()} • {game.genres?.slice(0, 2).map(g => g.name).join(', ')}
                  </p>
                </div>

                {/* Platforms */}
                <div className="flex gap-2">
                  {game.parent_platforms?.slice(0, 3).map(({ platform }) => (
                    <span 
                      key={platform.id}
                      className="text-xs px-2 py-1 rounded-full bg-stone-800 text-gray-400"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}