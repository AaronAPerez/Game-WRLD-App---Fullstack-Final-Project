import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Screenshot, Trailer } from '../../types/media';

interface MediaPlayerProps {
  screenshots?: Screenshot[];
  trailer?: Trailer;
}

const MediaPlayer = ({ screenshots = [], trailer }: MediaPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  if (isPlayingTrailer && trailer) {
    return (
      <video
        src={trailer.data.max}
        controls
        autoPlay
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={screenshots[currentIndex]?.image}
          alt="Game screenshot"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {screenshots.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {trailer && (
        <button
          onClick={() => setIsPlayingTrailer(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/50"
        >
          <Play className="w-16 h-16 text-white" />
        </button>
      )}
    </div>
  );
};

export default MediaPlayer;