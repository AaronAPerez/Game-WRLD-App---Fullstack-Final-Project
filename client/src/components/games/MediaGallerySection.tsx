import React from 'react';
import { useGameMedia } from '../../hooks/useGameMedia';
import { MediaGallery } from './MediaGallery';
import { Loader2, AlertTriangle } from 'lucide-react';

interface MediaGallerySectionProps {
  gameId: number;
  className?: string;
}

export const MediaGallerySection: React.FC<MediaGallerySectionProps> = ({
  gameId,
  className = ''
}) => {
  const { mediaItems, isLoading, error, hasScreenshots, hasTrailers } = useGameMedia(gameId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <span>Failed to load media content</span>
      </div>
    );
  }

  if (!hasScreenshots && !hasTrailers) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400">
        No media content available
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Media Stats */}
        <div className="flex gap-4 text-sm text-gray-400">
          {hasScreenshots && (
            <div>
              <span className="font-medium text-white">{mediaItems.filter(item => item.type === 'image').length}</span>
              {' Screenshots'}
            </div>
          )}
          {hasTrailers && (
            <div>
              <span className="font-medium text-white">{mediaItems.filter(item => item.type === 'video').length}</span>
              {' Videos'}
            </div>
          )}
        </div>

        {/* Media Gallery */}
        <MediaGallery
          items={mediaItems}
          initialView="grid"
        />
      </div>
    </div>
  );
};