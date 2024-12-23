import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Star, Tag } from 'lucide-react';
import type { Game } from '../types/rawg';
import { PlatformIcons } from './PlatformIcons';
import { cn } from '../utils/styles';

interface GameCardDetailsProps {
  game: Game;
  isExpanded: boolean;
}

export const GameCardDetails = ({ game, isExpanded }: GameCardDetailsProps) => {
  const releaseDate = new Date(game.released).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getMetacriticColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="p-4 space-y-4 bg-stone-900/50">
          {/* Quick Stats */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{releaseDate}</span>
            </div>
            <div className="flex items-center gap-2">
              {game.metacritic && (
                <span className={cn(
                  "px-2 py-1 rounded-full text-sm",
                  "bg-stone-800",
                  getMetacriticColor(game.metacritic)
                )}>
                  {game.metacritic}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{game.rating}/5</span>
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-400">Platforms</h4>
              <PlatformIcons platforms={game.parent_platforms.map((p: { platform: any; }) => p.platform)} />
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {game.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};