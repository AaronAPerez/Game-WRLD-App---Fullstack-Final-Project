import axios from 'axios';
import type {
  Game,
  PaginatedResponse,
  Genre,
  Platform,
  Screenshot,
  GameQueryParams,
  Developer,
  Publisher
} from '../types/rawg'


const RAWG_URL = 'https://api.rawg.io/api';

const apiClient = axios.create({
  baseURL: RAWG_URL,
  params: {
    key: '88682be5c94f45ec86a72c163e1a3a09'
  }
});

export const gameService = {
  // Games endpoints
  async getGames(params: GameQueryParams = {}): Promise<PaginatedResponse<Game>> {
    const response = await apiClient.get<PaginatedResponse<Game>>('/games', { params });
    return response.data;
  },

  async getGameDetails(id: number): Promise<Game> {
    const response = await apiClient.get<Game>(`/games/${id}`);
    return response.data;
  },

  async getGameScreenshots(id: number): Promise<PaginatedResponse<Screenshot>> {
    const response = await apiClient.get<PaginatedResponse<Screenshot>>(`/games/${id}/screenshots`);
    return response.data;
  },

  async getGameSeries(id: number): Promise<PaginatedResponse<Game>> {
    const response = await apiClient.get<PaginatedResponse<Game>>(`/games/${id}/game-series`);
    return response.data;
  },

  async getParentGames(id: number): Promise<PaginatedResponse<Game>> {
    const response = await apiClient.get<PaginatedResponse<Game>>(`/games/${id}/parent-games`);
    return response.data;
  },

  // Genre endpoints
  async getGenres(params?: { page?: number; page_size?: number; ordering?: string }): Promise<PaginatedResponse<Genre>> {
    const response = await apiClient.get<PaginatedResponse<Genre>>('/genres', { params });
    return response.data;
  },

  async getGenreDetails(id: number): Promise<Genre> {
    const response = await apiClient.get<Genre>(`/genres/${id}`);
    return response.data;
  },

  // Platform endpoints
  async getPlatforms(params?: { page?: number; page_size?: number; ordering?: string }): Promise<PaginatedResponse<Platform>> {
    const response = await apiClient.get<PaginatedResponse<Platform>>('/platforms', { params });
    return response.data;
  },

  async getParentPlatforms(): Promise<PaginatedResponse<Platform>> {
    const response = await apiClient.get<PaginatedResponse<Platform>>('/platforms/lists/parents');
    return response.data;
  },

  async getPlatformDetails(id: number): Promise<Platform> {
    const response = await apiClient.get<Platform>(`/platforms/${id}`);
    return response.data;
  },

  // Developer endpoints
  async getDevelopers(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<Developer>> {
    const response = await apiClient.get<PaginatedResponse<Developer>>('/developers', { params });
    return response.data;
  },

  async getDeveloperDetails(id: number): Promise<Developer> {
    const response = await apiClient.get<Developer>(`/developers/${id}`);
    return response.data;
  },

  // Publisher endpoints
  async getPublishers(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<Publisher>> {
    const response = await apiClient.get<PaginatedResponse<Publisher>>('/publishers', { params });
    return response.data;
  },

  async getPublisherDetails(id: number): Promise<Publisher> {
    const response = await apiClient.get<Publisher>(`/publishers/${id}`);
    return response.data;
  }
};

// Helper functions
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getMetacriticColor = (score: number | null) => {
  if (!score) return 'text-gray-400';
  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};