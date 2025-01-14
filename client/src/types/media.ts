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

export interface MediaResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  thumbnail: string;
  fullUrl: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  image: string;
  percent: string;
}

export interface DLC {
  id: number;
  name: string;
  background_image: string;
  description: string;
  released: string;
  rating: number;
}

export interface MediaError {
  message: string;
  status: number;
  retry?: boolean;
}