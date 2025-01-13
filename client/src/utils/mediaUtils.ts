import { MediaItem, Screenshot, Trailer } from '../types/media';

export const formatMediaItems = (
  screenshots: Screenshot[],
  trailers: Trailer[]
): MediaItem[] => {
  const mediaItems: MediaItem[] = [];

  // Format trailers
  trailers.forEach((trailer) => {
    mediaItems.push({
      id: trailer.id,
      type: 'video',
      thumbnail: trailer.preview,
      fullUrl: trailer.data.max,
      title: trailer.name,
    });
  });

  // Format screenshots
  screenshots.forEach((screenshot) => {
    mediaItems.push({
      id: screenshot.id,
      type: 'image',
      thumbnail: screenshot.image,
      fullUrl: screenshot.image,
    });
  });

  return mediaItems;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const getAspectRatio = (width: number, height: number): string => {
  return `${Math.round((height / width) * 100)}%`;
};