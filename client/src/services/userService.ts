import axios from 'axios';
import { BASE_URL } from '../constant';

const api = axios.create({
  baseURL: `${BASE_URL}/User`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally redirect to login or handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/home'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export const UserService = {
  async getFriendRequests() {
    const response = await api.get('/Friends/Requests');
    return response.data;
  },

  async sendFriendRequest(addresseeId: number) {
    const response = await api.post('/Friends/Request', { addresseeId });
    return response.data;
  },

  async respondToFriendRequest(requestId: number, accept: boolean) {
    const response = await api.post('/Friends/Respond', { requestId, accept });
    return response.data;
  },

  async getFriends() {
    const response = await api.get('/Friends');
    return response.data;
  },

  async searchUsers(query: string) {
    const response = await api.get('/search', { params: { query } });
    return response.data;
  },

  async updateAvatar(formData: FormData) {
    const response = await api.post('/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // New: Get user's profile details
  async getUserProfile() {
    const response = await api.get('/Profile');
    return response.data;
  },

  // New: Update user's profile
  async updateUserProfile(updatedProfileData: any) {
    const response = await api.put('/Profile', updatedProfileData);
    return response.data;
  },

  // New: Handle searching friends by username or friend code
  async searchFriends(query: string) {
    const response = await api.get('/search', { params: { query } });
    return response.data;
  },

  // New: Fetch current user's game library (optional based on the front-end needs)
  async getUserGames() {
    const response = await api.get('/Games');
    return response.data;
  },

  // New: Adding a game to the user's game library
  async addUserGame(gameData: any) {
    const response = await api.post('/Games', gameData);
    return response.data;
  },
};
