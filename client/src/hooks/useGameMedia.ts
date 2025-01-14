// src/hooks/useGameMedia.ts
import { useQuery } from '@tanstack/react-query';
import { gameService } from '../services/gameService';
import { formatMediaItems } from '../utils/mediaUtils';
import { MediaItem } from '../types/media';

export const useGameMedia = (gameId: number) => {
  // Fetch screenshots
  const {
    data: screenshots,
    isLoading: isLoadingScreenshots,
    error: screenshotsError
  } = useQuery({
    queryKey: ['game', gameId, 'screenshots'],
    queryFn: () => gameService.getGameScreenshots(gameId),
    enabled: !!gameId,
  });

  // Fetch trailers/videos
  const {
    data: trailers,
    isLoading: isLoadingTrailers,
    error: trailersError
  } = useQuery({
    queryKey: ['game', gameId, 'trailers'],
    queryFn: () => gameService.getGameTrailers(gameId),
    enabled: !!gameId,
  });

  // Format media items
  const mediaItems: MediaItem[] = formatMediaItems(
    screenshots?.results || [],
    trailers?.results || []
  );

  const isLoading = isLoadingScreenshots || isLoadingTrailers;
  const error = screenshotsError || trailersError;

  return {
    mediaItems,
    isLoading,
    error,
    hasScreenshots: screenshots?.results?.length > 0,
    hasTrailers: trailers?.results?.length > 0,
  };
};