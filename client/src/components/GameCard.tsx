import { motion } from "framer-motion";
import { Calendar, ChartLine, Eye, Star } from "lucide-react";
import { useState } from 'react';
import type { Game } from '../types/rawg';
import { useGameStore } from "./store/gameStore";
import { cn } from "../utils/styles";

// Props interface for GameCard component
interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
  rank: number; // rank displaying position in lists
}


export const GameCard = ({ game, onClick, rank }: GameCardProps) => {
  // State management
  const [isHovering, setIsHovering] = useState(false);



  // Global state management for favorites
  const { addToFavorites, isGameInCollection } = useGameStore();
  const isFavorite = isGameInCollection(game.id, 'favorites');

  // Format release date for display
  const releaseDate = new Date(game.released);
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  /* Metacritic score color*/
  const getMetacriticColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };


  // Animation variants for favorite star
  const starVariants = {
    unfavorited: { scale: 1, rotate: 0 },
    favorited: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 180],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      exit={{ opacity: 0, y: 20 }}
      className="group relative bg-stone-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      {/* Rank Badge*/}
      {rank && (
        <div className="absolute left-3 z-20 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm">
          <ChartLine className="w-4 h-4" />
          <span>#{rank}</span>
        </div>
      )}

      {/* Favorite Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          addToFavorites(game);
        }}
        className={cn(
          "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-colors",
          "hover:bg-black/50",
          isFavorite ? "bg-black/70" : "bg-black/30"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <motion.div
          variants={starVariants}
          animate={isFavorite ? 'favorited' : 'unfavorited'}
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
            )}
          />
        </motion.div>
      </motion.button>

      <div className="relative aspect-video">
        {/* Base Image */}
        <img src={game.background_image} alt={game.name} />


        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            {/* Game Details (Release Date & Metacritic) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-stone-900/50 backdrop-blur-sm text-gray-300 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>

              {game.metacritic && (
                <div className={cn(
                  "px-2 py-1 rounded-full bg-stone-900/50 backdrop-blur-sm text-sm",
                  getMetacriticColor(game.metacritic)
                )}>
                  {game.metacritic}
                </div>
              )}
            </div>

            {/* View Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(game);
              }}
              className="p-2 bg-stone-900/50 backdrop-blur-sm rounded-full hover:bg-stone-900 transition-colors"
              aria-label="View game details"
            >
              <Eye className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Game Information */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white  line-clamp-1 mb-3">
          {game.name}
        </h3>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2">
          {game.genres?.slice(0, 2).map(genre => (
            <span
              key={genre.id}
              className="text-sm px-2 py-1 rounded-full bg-blue-500/20 text-blue-400"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};