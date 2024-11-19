export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
  
  export interface Game {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings_count: number;
    reviews_count: number;
    metacritic: number | null;
    playtime: number;
    updated: string;
    genres: Genre[];
    platforms: PlatformInfo[];
    stores: StoreInfo[];
    developers: Developer[];
    publishers: Publisher[];
    esrb_rating: ESRB | null;
    description_raw?: string;
  }
  
  export interface Genre {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    description?: string;
  }
  
  export interface Platform {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    description?: string;
  }
  
  export interface PlatformInfo {
    platform: Platform;
    released_at?: string;
    requirements?: {
      minimum?: string;
      recommended?: string;
    };
  }
  
  export interface Developer {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }
  
  export interface Publisher {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }
  
  export interface Screenshot {
    id: number;
    image: string;
    width: number;
    height: number;
  }
  
  export interface ESRB {
    id: number;
    name: string;
    slug: string;
  }
  
  export interface StoreInfo {
    store: {
      id: number;
      name: string;
      slug: string;
    };
  }
  
  export interface GameQueryParams {
    page?: number;
    page_size?: number;
    search?: string;
    search_precise?: boolean;
    search_exact?: boolean;
    parent_platforms?: string;
    platforms?: string;
    stores?: string;
    developers?: string;
    publishers?: string;
    genres?: string;
    tags?: string;
    creators?: string;
    dates?: string;
    updated?: string;
    platforms_count?: number;
    metacritic?: string;
    exclude_collection?: number;
    exclude_additions?: boolean;
    exclude_parents?: boolean;
    exclude_game_series?: boolean;
    exclude_stores?: string;
    ordering?: string;
  }