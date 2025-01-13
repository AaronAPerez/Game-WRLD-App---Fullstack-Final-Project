import { useState, useCallback, useRef, useEffect } from 'react';
import { MediaItem } from '../types/media';
import { preloadImage } from '../utils/mediaUtils';

interface UseMediaGalleryProps {
  items: MediaItem[];
  initialView?: 'grid' | 'carousel';
  preloadAdjacent?: boolean;
}

export const useMediaGallery = ({
  items,
  initialView = 'grid',
  preloadAdjacent = true
}: UseMediaGalleryProps) => {
  const [view, setView] = useState(initialView);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Refs for carousel functionality
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Preload adjacent images when lightbox is open
  const preloadAdjacentImages = useCallback(async (currentIndex: number) => {
    if (!preloadAdjacent) return;
    
    setIsLoading(true);
    try {
      const preloadPromises: Promise<void>[] = [];
      
      // Preload previous image
      if (currentIndex > 0 && items[currentIndex - 1].type === 'image') {
        preloadPromises.push(preloadImage(items[currentIndex - 1].fullUrl));
      }
      
      // Preload current image
      if (items[currentIndex].type === 'image') {
        preloadPromises.push(preloadImage(items[currentIndex].fullUrl));
      }
      
      // Preload next image
      if (currentIndex < items.length - 1 && items[currentIndex + 1].type === 'image') {
        preloadPromises.push(preloadImage(items[currentIndex + 1].fullUrl));
      }
      
      await Promise.all(preloadPromises);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to preload images'));
    } finally {
      setIsLoading(false);
    }
  }, [items, preloadAdjacent]);

  // Handle item selection
  const handleSelectItem = useCallback(async (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
    await preloadAdjacentImages(index);
  }, [preloadAdjacentImages]);

  // Handle navigation in lightbox
  const handleNavigate = useCallback(async (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? Math.max(0, selectedIndex - 1)
      : Math.min(items.length - 1, selectedIndex + 1);
      
    setSelectedIndex(newIndex);
    await preloadAdjacentImages(newIndex);
  }, [selectedIndex, items.length, preloadAdjacentImages]);

  // Handle carousel scroll
  const handleCarouselScroll = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  // Handle touch events for mobile swipe
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;
      
      const swipeDistance = touchEndX.current - touchStartX.current;
      const minSwipeDistance = 50;
      
      if (Math.abs(swipeDistance) >= minSwipeDistance) {
        if (swipeDistance > 0) {
          handleNavigate('prev');
        } else {
          handleNavigate('next');
        }
      }
      
      touchStartX.current = null;
      touchEndX.current = null;
    };

    if (isLightboxOpen) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLightboxOpen, handleNavigate]);

  return {
    view,
    setView,
    selectedIndex,
    isLightboxOpen,
    isLoading,
    error,
    carouselRef,
    handleSelectItem,
    handleNavigate,
    handleCarouselScroll,
    setIsLightboxOpen,
  };
};