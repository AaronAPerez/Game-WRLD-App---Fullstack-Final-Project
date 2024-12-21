import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import { cn } from '../../utils/styles';
import type { Game } from '../../types/rawg';

interface GameCarouselProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
}

const GameCarousel = ({ games, onGameSelect }: GameCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [games.length, isAutoPlaying]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const currentGame = games[currentIndex];

  return (
    <div className="relative h-[70vh] group" 
         onMouseEnter={() => setIsAutoPlaying(false)}
         onMouseLeave={() => setIsAutoPlaying(true)}>
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => onGameSelect(currentGame)}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="relative h-full">
            <img
              src={currentGame.background_image}
              alt={currentGame.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                {currentGame.metacritic && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    {currentGame.metacritic}
                  </span>
                )}
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span>{currentGame.rating}/5</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl">
                {currentGame.name}
              </h1>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(currentGame.released).getFullYear()}</span>
                </div>
                <div className="flex gap-2">
                  {currentGame.genres?.slice(0, 3).map(genre => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className={cn(
            "p-2 rounded-full bg-black/50 backdrop-blur-sm text-white",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-white/20"
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className={cn(
            "p-2 rounded-full bg-black/50 backdrop-blur-sm text-white",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-white/20"
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={cn(
              "w-8 h-1 rounded-full transition-all",
              index === currentIndex 
                ? "bg-white" 
                : "bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default GameCarousel;