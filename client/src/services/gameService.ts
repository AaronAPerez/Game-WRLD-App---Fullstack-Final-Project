import axios from 'axios';
import { GameQueryParams } from '../types/game';
import { Game, Platform, Genre } from '../types/game';
import { Screenshot, Trailer } from '../types/media';

interface GameResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

interface MediaResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface FilterParams {
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

const RAWG_URL = 'https://api.rawg.io/api';
const API_KEY = '88682be5c94f45ec86a72c163e1a3a09';

export const gameService = axios.create({
  baseURL: RAWG_URL,
  params: {
    key: API_KEY,
  },
});

// Game Methods
export const getGames = async (params: FilterParams): Promise<GameResponse> => {
  const response = await gameService.get<GameResponse>('/games', { params });
  return response.data;
};

export const getGameDetails = async (id: number): Promise<Game> => {
  const response = await gameService.get<Game>(`/games/${id}`);
  return response.data;
};

// Media Methods
export const getGameScreenshots = async (id: number): Promise<Screenshot[]> => {
  try {
    const response = await gameService.get<MediaResponse<Screenshot>>(`/games/${id}/screenshots`);
    
    // Transform and validate screenshot data
    const screenshots = response.data.results.map(screenshot => ({
      ...screenshot,
      // Ensure image URL is properly formatted
      image: screenshot.image.startsWith('http') 
        ? screenshot.image 
        : `https://${screenshot.image}`
    }));

    return screenshots;
  } catch (error) {
    console.error('Error fetching game screenshots:', error);
    throw new Error('Failed to fetch game screenshots');
  }
};

export const getGameTrailers = async (id: number): Promise<Trailer[]> => {
  try {
    const response = await gameService.get<MediaResponse<Trailer>>(`/games/${id}/movies`);
    
    // Transform and validate trailer data
    const trailers = response.data.results
      .filter(trailer => {
        // Filter out invalid trailers
        return trailer.data && (trailer.data.max || trailer.data[480]);
      })
      .map(trailer => ({
        ...trailer,
        // Ensure preview image URL is properly formatted
        preview: trailer.preview?.startsWith('http') 
          ? trailer.preview 
          : `https://${trailer.preview}`,
        data: {
          ...trailer.data,
          // Ensure video URLs are properly formatted
          max: trailer.data.max?.startsWith('http') 
            ? trailer.data.max 
            : `https://${trailer.data.max}`,
          480: trailer.data[480]?.startsWith('http') 
            ? trailer.data[480] 
            : `https://${trailer.data[480]}`
        }
      }));

    return trailers;
  } catch (error) {
    console.error('Error fetching game trailers:', error);
    throw new Error('Failed to fetch game trailers');
  }
};

// Mmethod to fetch both screenshots and trailers at once
export const getGameMedia = async (id: number) => {
  try {
    const [screenshots, trailers] = await Promise.all([
      getGameScreenshots(id),
      getGameTrailers(id)
    ]);

    return {
      screenshots,
      trailers
    };
  } catch (error) {
    console.error('Error fetching game media:', error);
    throw new Error('Failed to fetch game media');
  }
};

// Add caching for media requests
const mediaCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedGameMedia = async (id: number) => {
  const cacheKey = `media-${id}`;
  const cachedData = mediaCache.get(cacheKey);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const mediaData = await getGameMedia(id);
  mediaCache.set(cacheKey, {
    data: mediaData,
    timestamp: Date.now()
  });

  return mediaData;
};

// Error handling interceptoR
gameService.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle rate limiting with exponential backoff
    if (error.response?.status === 429) {
      const retryCount = (error.config.retryCount || 0) + 1;
      const maxRetries = 3;
      
      if (retryCount <= maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        error.config.retryCount = retryCount;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return gameService(error.config);
      }
    }
    
    // Enhanced error handling
    const errorMessage = error.response?.data?.error 
      || error.message 
      || 'An unknown error occurred';

    // Add request context to error
    const enhancedError = new Error(errorMessage);
    enhancedError.config = error.config;
    enhancedError.response = error.response;
    
    throw enhancedError;
  }
);

// Add request interceptor for default params
gameService.interceptors.request.use((config) => {
  // Add default params to all requests
  config.params = {
    ...config.params,
    key: API_KEY
  };
  return config;
});

export default gameService;