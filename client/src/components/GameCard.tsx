import { motion } from "framer-motion";
import { Calendar, Star, Eye, ChartLine } from "lucide-react";
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


export function GameCard({ game, onClick, rank }: GameCardProps) {
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
      className={cn(
        "group relative bg-stone-950/50 rounded-xl overflow-hidden",
        "backdrop-blur-sm border border-stone-800/50",
        "hover:border-indigo-500/30 transition-all duration-300",
        "before:absolute before:inset-0 before:rounded-xl before:opacity-0",
        "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
        "hover:before:opacity-100"
      )}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >


      {/* Rank Badge (if provided) */}
      {rank && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm">
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

      {/* Media Container (Image/Video) */}
      <div className="relative aspect-video">
        {/* Base Image */}
        <img
          src={game.background_image}
          alt={game.name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-3 opacity-100"
          )}
          loading="lazy"
        />
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            {/* Game Details (Release Date & Metacritic) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-stone-900/50 backdrop-blur-sm text-gray-300 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
            {/* View Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(game);
              }}
              className="p-2 bg-stone-900/50 backdrop-blur-sm rounded-full hover:bg-stone-800 transition-colors"
              aria-label="View game details"
            >
              <Eye className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      {/* Game Info */}
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-lg text-white line-clamp-1">
          {game.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {game.genres?.slice(0, 2).map(genre => (
              <span
                key={genre.id}
                className="text-xs px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span>
              {game.metacritic && (
                <div className={cn(
                  "px-2 py-1 rounded-full text-sm bg-green-950",
                  getMetacriticColor(game.metacritic)
                )}>
                  {game.metacritic}
                </div>
              )}
            </span>
          </div>
        </div>
        {/* Game Details (Release Date & Rating) */}
        <div className="flex items-center gap-4">
        <Calendar className="w-4 h-4" />
        <span>{new Date(game.released).getFullYear()}</span>
          <Star className="w-4 h-4 text-yellow-500 text-end" />
          <span>{game.rating}/5</span>
        </div>
      </div>
    </motion.div>
  );
}