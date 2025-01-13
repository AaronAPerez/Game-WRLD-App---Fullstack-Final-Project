import { MediaItem } from "../types/media";

export const validateMediaItem = (item: MediaItem): boolean => {
    const requiredFields: (keyof MediaItem)[] = ['id', 'type', 'thumbnail', 'fullUrl'];
    
    for (const field of requiredFields) {
      if (!item[field]) return false;
    }
    
    if (!['image', 'video'].includes(item.type)) return false;
    
    return true;
  };