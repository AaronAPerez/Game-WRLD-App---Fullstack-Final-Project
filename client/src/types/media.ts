export interface MediaItem {
    id: number;
    type: 'image' | 'video';
    thumbnail: string;
    fullUrl: string;
    title?: string;
    description?: string;
  }
  
  export interface Screenshot {
    id: number;
    image: string;
    width: number;
    height: number;
  }
  
  export interface Trailer {
    id: number;
    name: string;
    preview: string;
    data: {
      480: string;
      max: string;
    };
  }