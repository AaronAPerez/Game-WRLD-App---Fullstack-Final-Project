import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GameCard } from '../components/game/GameCard';
import { gameService } from '../services/gameService';
import { useState } from 'react';
import { GameDetailsModal } from '../components/GameDetailsModal';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/styles';
import type { Game, GameQueryParams, PaginatedResponse } from '../types/rawg';
import { LucideIcon } from 'lucide-react';

// Props interface
interface GamesListProps {
  title: string;
  queryKey: string;
  queryParams: GameQueryParams;
  icon: LucideIcon;
}

const GamesList = ({ title, queryKey, queryParams, icon: Icon }: GamesListProps) => {
  // State for selected game modal
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Use infinite query for pagination
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<PaginatedResponse<Game>, Error>({
    queryKey: [queryKey, queryParams],
    queryFn: ({ pageParam = 1 }) => 
      gameService.getGames({ 
        ...queryParams, 
        page: pageParam as number 
      }),
    getNextPageParam: (lastPage: PaginatedResponse<Game>) => {
      if (lastPage.next) {
        const nextPage = new URLSearchParams(new URL(lastPage.next).search)
          .get('page');
        return nextPage ? parseInt(nextPage) : undefined;
      }
      return undefined;
    },
    initialPageParam: 1
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Flatten pages into single array of games
  const games = data?.pages.flatMap(page => page.results) ?? [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-indigo-500" />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game: Game, index: number) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GameCard 
              game={game}
              onClick={() => 
              setSelectedGame(game)}
              rank={index + 1}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={cn(
              "px-6 py-3 rounded-lg font-medium",
              "bg-indigo-500/20 text-indigo-400",
              "hover:bg-indigo-500/30 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* Game Details Modal */}
      {selectedGame && (
        <GameDetailsModal
          gameId={selectedGame.id}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
};

export default GamesList;