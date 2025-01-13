import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, X, Maximize2, 
  Play, Image as ImageIcon, Grid, Loader2 
} from 'lucide-react';
import { MediaItem } from '../../types/media';
import { preloadImage } from '../../utils/mediaUtils';

interface MediaGalleryProps {
  items: MediaItem[];
  initialView?: 'grid' | 'carousel';
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  items, 
  initialView = 'grid' 
}) => {
  const [view, setView] = useState(initialView);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleItemClick = async (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
    
    // Preload adjacent images
    if (items[index].type === 'image') {
      setIsLoading(true);
      try {
        await Promise.all([
          items[index - 1]?.type === 'image' && preloadImage(items[index - 1].fullUrl),
          preloadImage(items[index].fullUrl),
          items[index + 1]?.type === 'image' && preloadImage(items[index + 1].fullUrl),
        ]);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setView('grid')}
          className={`p-2 rounded-lg transition-colors ${
            view === 'grid' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Grid size={20} />
        </button>
        <button
          onClick={() => setView('carousel')}
          className={`p-2 rounded-lg transition-colors ${
            view === 'carousel'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <ImageIcon size={20} />
        </button>
      </div>

      {/* Media Grid */}
      {view === 'grid' && (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {items.map((item, index) => (
            <MediaGridItem
              key={item.id}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </motion.div>
      )}

      {/* Media Carousel */}
      {view === 'carousel' && (
        <MediaCarousel
          items={items}
          onItemClick={handleItemClick}
        />
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedIndex !== null && (
          <MediaLightbox
            items={items}
            initialIndex={selectedIndex}
            onClose={() => setIsLightboxOpen(false)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Media Grid Item Component
interface MediaGridItemProps {
  item: MediaItem;
  onClick: () => void;
}

const MediaGridItem: React.FC<MediaGridItemProps> = ({ item, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative aspect-video group cursor-pointer"
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      )}
      
      <img
        src={item.thumbnail}
        alt={item.title || ''}
        className="w-full h-full object-cover rounded-lg"
        onLoad={() => setIsLoading(false)}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
        transition-opacity rounded-lg flex items-center justify-center">
        {item.type === 'video' ? (
          <Play className="w-12 h-12 text-white" />
        ) : (
          <Maximize2 className="w-8 h-8 text-white" />
        )}
      </div>
    </motion.div>
  );
};

// Media Carousel Component
interface MediaCarouselProps {
  items: MediaItem[];
  onItemClick: (index: number) => void;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ items, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 
          rounded-full opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-black/75 disabled:opacity-0"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={() => handleScroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 
          rounded-full opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-black/75 disabled:opacity-0"
        disabled={currentIndex === items.length - 1}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex-none w-4/5 snap-center px-2"
          >
            <div
              className="relative aspect-video cursor-pointer"
              onClick={() => onItemClick(index)}
            >
              <img
                src={item.thumbnail}
                alt={item.title || ''}
                className="w-full h-full object-cover rounded-lg"
              />
              
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/75 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Media Lightbox Component
interface MediaLightboxProps {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
  isLoading: boolean;
}

const MediaLightbox: React.FC<MediaLightboxProps> = ({
  items,
  initialIndex,
  onClose,
  isLoading,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handleNavigate('prev');
      if (e.key === 'ArrowRight') handleNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/75 hover:text-white"
      >
        <X size={24} />
      </button>

      {/* Navigation */}
      <button
        onClick={() => handleNavigate('prev')}
        className="absolute left-4 p-2 text-white/75 hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={() => handleNavigate('next')}
        className="absolute right-4 p-2 text-white/75 hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentIndex === items.length - 1}
      >
        <ChevronRight size={32} />
      </button>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="relative aspect-video">
            {items[currentIndex].type === 'video' ? (
              <video
                src={items[currentIndex].fullUrl}
                controls
                className="w-full h-full object-contain"
                autoPlay
              />
            ) : (
              <img
                src={items[currentIndex].fullUrl}
                alt={items[currentIndex].title || ''}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        )}

        {/* Caption */}
        {items[currentIndex].title && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white text-lg font-medium">
              {items[currentIndex].title}
            </p>
            {items[currentIndex].description && (
              <p className="text-white/75 text-sm mt-1">
                {items[currentIndex].description}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MediaGallery;