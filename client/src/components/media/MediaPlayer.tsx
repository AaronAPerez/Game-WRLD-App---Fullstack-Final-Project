import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaPlayerProps {
  trailer?: any;
  screenshots: any[];
}

const MediaPlayer = ({ trailer, screenshots }: MediaPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
      <AnimatePresence mode="wait">
        {isPlaying && trailer ? (
          <motion.video
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={trailer.data.max}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.div
            key="screenshots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            <img
              src={screenshots[currentIndex].image}
              alt="Screenshot"
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Play Button if trailer exists */}
            {trailer && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-16 h-16 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaPlayer;