import axios from 'axios';
import { BASE_URL } from '../constant';

const api = axios.create({
  baseURL: `${BASE_URL}/User`,
  headers: {
    'Content-Type': 'application/json'
  }
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
      window.location.href = '/login';
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
  }
};



