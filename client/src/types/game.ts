export interface Game {
  id: number;
  name: string;
  slug: string;
  background_image: string;
  released: string;
  rating: number;
  metacritic: number;
  platforms: Platform[];
  genres: Genre[];
  short_screenshots: Screenshot[];
  description_raw?: string;
}

export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GameQueryParams {
  search?: string;
  platforms?: string;
  genres?: string;
  ordering?: string;
  dates?: string;
  metacritic?: string;
  tags?: string;
  page?: number;
  page_size?: number;
}