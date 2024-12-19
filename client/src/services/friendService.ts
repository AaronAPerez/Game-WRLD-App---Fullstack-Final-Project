import axios from 'axios';
import type { FriendRequest } from '../types/chat';
import { API_ENDPOINTS, BASE_URL } from '../constants';
import { UserProfile } from '../types';

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

export const friendService = {
  // Friend Requests
  async getFriendRequests(): Promise<{
    received: FriendRequest[];
    sent: FriendRequest[];
  }> {
    const response = await api.get(API_ENDPOINTS.USER.FRIEND_REQUESTS);
    return response.data;
  },

  async sendFriendRequest(userId: number): Promise<boolean> {
    const response = await api.post(API_ENDPOINTS.USER.FRIEND_REQUEST_SEND, {
      addresseeName: userId,
      stsatus: 'pending'
    });
    return response.data;
  },

  async respondToFriendRequest(requestId: number, accept: boolean): Promise<boolean> {
    const response = await api.post(API_ENDPOINTS.USER.FRIEND_REQUEST_RESPOND, {
      requestId,
      accept
    });
    return response.data;
  },

  // Friends Management
  async getFriends(): Promise<UserProfile[]> {
    const response = await api.get(API_ENDPOINTS.USER.FRIENDS);
    return response.data;
  },

  async removeFriend(friendId: number): Promise<boolean> {
    const response = await api.delete(`${API_ENDPOINTS.USER.FRIENDS}/${friendId}`);
    return response.data;
  },

  // Friend Status
  async getUserFriendStatus(userId: number): Promise<{
    isFriend: boolean;
    isPending: boolean;
  }> {
    const response = await api.get(`${API_ENDPOINTS.USER.FRIENDS}/status/${userId}`);
    return response.data;
  },

  // Friend Search
  async searchFriends(query: string): Promise<UserProfile[]> {
    const response = await api.get(`${API_ENDPOINTS.USER.FRIENDS}/search`, {
      params: { query }
    });
    return response.data;
  }
};