import axios from 'axios';
import { Game } from '../types/game';
import { MediaResponse, Screenshot, Trailer } from '../types/media';

export interface FilterParams {
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

export interface Response {
  count: number;
  next: string | null;
  results: Game[];
}

const RAWG_URL = 'https://api.rawg.io/api';
export const API_KEY = '88682be5c94f45ec86a72c163e1a3a09';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: RAWG_URL,
  params: {
    key: API_KEY,
  },
});

// Create gameService object with all methods
const gameService = {
  // Platform, Genre, Tag Methods
  getPlatforms: async () => {
    const response = await axiosInstance.get('/platforms');
    return response.data;
  },

  getGenres: async () => {
    const response = await axiosInstance.get('/genres');
    return response.data;
  },

  getTags: async () => {
    const response = await axiosInstance.get('/tags');
    return response.data;
  },

  // Game Methods 
  getGames: async (params: FilterParams): Promise<Response> => {
    const response = await axiosInstance.get<Response>('/games', { params });
    return response.data;
  },

  getGameDetails: async (id: number): Promise<Game> => {
    const response = await axiosInstance.get<Game>(`/games/${id}`);
    return response.data;
  },

  // Media Methods
  getGameScreenshots: async (id: number): Promise<Screenshot[]> => {
    try {
      const response = await axiosInstance.get<MediaResponse<Screenshot>>(`/games/${id}/screenshots`);
      return response.data.results.map(screenshot => ({
        ...screenshot,
        image: screenshot.image.startsWith('http') 
          ? screenshot.image 
          : `https://${screenshot.image}`
      }));
    } catch (error) {
      console.error('Error fetching game screenshots:', error);
      throw new Error('Failed to fetch game screenshots');
    }
  },

  getGameTrailers: async (id: number): Promise<Trailer[]> => {
    try {
      const response = await axiosInstance.get<MediaResponse<Trailer>>(`/games/${id}/movies`);
      return response.data.results
        .filter(trailer => trailer.data && (trailer.data.max || trailer.data[480]))
        .map(trailer => ({
          ...trailer,
          preview: trailer.preview?.startsWith('http') 
            ? trailer.preview 
            : `https://${trailer.preview}`,
          data: {
            ...trailer.data,
            max: trailer.data.max?.startsWith('http') 
              ? trailer.data.max 
              : `https://${trailer.data.max}`,
            480: trailer.data[480]?.startsWith('http') 
              ? trailer.data[480] 
              : `https://${trailer.data[480]}`
          }
        }));
    } catch (error) {
      console.error('Error fetching game trailers:', error);
      throw new Error('Failed to fetch game trailers');
    }
  }
};

export default gameService;