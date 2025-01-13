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

export interface GameQueryParams {
  page: number;
  page_size: number;
  search?: string;
  genres?: string;
  platforms?: string;
  ordering?: string;
}