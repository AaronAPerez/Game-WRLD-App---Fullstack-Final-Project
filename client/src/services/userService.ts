import axios from 'axios';
import { BASE_URL } from '../constant';
import { User } from '../types';

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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
     
      localStorage.removeItem('token');
      window.location.href = '/home'; 
    }
    return Promise.reject(error);
  }
);

export const UserService = {
  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get('/search', { params: { query } });
    return response.data;
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User> {
    const response = await api.get(`/?username=${username}`)
    return response.data
  },

  // Update user profile
  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await api.put(`/${userId}`, data)
  },

  // Get friends list
  async getFriends(userId: string): Promise<User[]> {
    const response = await api.get(`/friends/${userId}`)
    return response.data
  },

  // Follow user
  async followUser(userId: string, targetId: string): Promise<void> {
    await api.put(`/${targetId}/follow`, { userId })
  },

  // Unfollow user
  async unfollowUser(userId: string, targetId: string): Promise<void> {
    await api.put(`/${targetId}/unfollow`, { userId })
  },
  async sendFriendRequest(addresseeId: number) {
    const response = await api.post('/Friends/Request', { addresseeId })
    return response.data
  },

  async respondToFriendRequest(requestId: number, accept: boolean) {
    const response = await api.post('/Friends/Respond', { requestId, accept })
    return response.data
  },


  async updateAvatar(formData: FormData) {
    const response = await api.post('/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}


