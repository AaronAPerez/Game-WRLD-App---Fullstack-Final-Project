import axios from 'axios';

import { UserProfile } from '../types';
import { API_ENDPOINTS, BASE_URL } from '../constants';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // User Authentication
  async login(username: string, password: string): Promise<{ token: string; userId: number }> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      userName: username,
      password
    });
    return response.data;
  },

  async signup(username: string, password: string): Promise<boolean> {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, {
      username,
      password
    });
    return response.data;
  },

  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  async updateProfile(data: { 
    username?: string; 
    avatar?: string; 
  }): Promise<boolean> {
    const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    return response.data;
  },

  // User Search
  async searchUsers(query: string): Promise<UserProfile[]> {
    const response = await api.get(API_ENDPOINTS.USER.SEARCH, {
      params: { query }
    });
    return response.data;
  },

  async getUserByUsername(username: string): Promise<UserProfile> {
    const response = await api.get(API_ENDPOINTS.USER.GET_BY_USERNAME(username));
    return response.data;
  },

  // User Games
  async getUserGames(): Promise<any[]> {
    const response = await api.get(API_ENDPOINTS.USER.GAMES);
    return response.data;
  },

  async addUserGame(gameId: number, isFavorite: boolean): Promise<boolean> {
    const response = await api.post(API_ENDPOINTS.USER.GAMES, {
      gameId,
      isFavorite
    });
    return response.data;
  },
  async updateAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    const response = await api.put(`${API_ENDPOINTS.AUTH.UPDATE_PROFILE}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },


  // Error Handler
  handleError(error: any) {
    if (axios.isAxiosError(error)) {
      // Handle different error status codes
      switch (error.response?.status) {
        case 401:
          throw new Error('Unauthorized. Please log in again.');
        case 403:
          throw new Error('You do not have permission to perform this action.');
        case 404:
          throw new Error('The requested resource was not found.');
        case 422:
          throw new Error('Invalid data provided.');
        default:
          throw new Error('An error occurred. Please try again later.');
      }
    }
    throw error;
  }
};