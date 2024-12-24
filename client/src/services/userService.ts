import axios from 'axios';
import { BASE_URL } from '../constants';
import { UpdateUserProfileDTO } from '../types';

export const api = axios.create({
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
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Optionally redirect to login or handle token expiration
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );



export const UserService = {
  // Get User Profile
  async getUserProfile(userId: string) {
    return api.get(`/User/Profile/${userId}`);
  },

  async updateProfile(data: UpdateUserProfileDTO) {
    return api.put('/User/Profile', data);
  },
  // Search users
  searchUsers: async (query: string) => {
    return await api.get(`/User/search?query=${query}`);
  },

  // Get friends list
  getFriends: async () => {
    return await api.get('/User/Friends');
  },

  // Get friend requests
  getFriendRequests: async () => {
    return await api.get('/User/Friends/Requests');
  },

  // Send friend request
  sendFriendRequest: async (userId: number) => {
    return await api.post('/User/Friends/Request', { addresseeId: userId });
  },

  // Respond to friend request
  respondToFriendRequest: async (requestId: number, accept: boolean) => {
    return await api.post('/User/Friends/Respond', { requestId, accept });
  },

   //Update Avatar  
    async updateAvatar(formData: FormData) {
    const response = await api.post('/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};



