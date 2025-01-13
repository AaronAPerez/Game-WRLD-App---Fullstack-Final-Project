import React from 'react';
import { MediaGallerySection } from './MediaGallerySection';

interface MediaGalleryTabProps {
  gameId: number;
}

export const MediaGalleryTab: React.FC<MediaGalleryTabProps> = ({ gameId }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Media Gallery</h2>
      </div>

      <MediaGallerySection gameId={gameId} />
    </div>
  );
};