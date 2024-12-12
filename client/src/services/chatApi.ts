import axios from 'axios';
import { BASE_URL } from '../constant';
import type { ChatRoom, ChatMessage, DirectMessage, SendMessageRequest } from '../types/chat';

const api = axios.create({
  baseURL: `${BASE_URL}/chat`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatApi = {
  // Rooms
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getRoom: async (roomId: number): Promise<ChatRoom> => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  createRoom: async (name: string, isPrivate = false): Promise<ChatRoom> => {
    const response = await api.post('/rooms', { name, isPrivate });
    return response.data;
  },

  joinRoom: async (roomId: number): Promise<void> => {
    await api.post(`/rooms/${roomId}/join`);
  },

  leaveRoom: async (roomId: number): Promise<void> => {
    await api.post(`/rooms/${roomId}/leave`);
  },

  // Messages
  getRoomMessages: async (roomId: number, page = 1): Promise<ChatMessage[]> => {
    const response = await api.get(`/rooms/${roomId}/messages?page=${page}`);
    return response.data;
  },

  getDirectMessages: async (userId: number, page = 1): Promise<DirectMessage[]> => {
    const response = await api.get(`/direct/${userId}?page=${page}`);
    return response.data;
  },

  sendMessage: async (request: SendMessageRequest): Promise<ChatMessage> => {
    const response = await api.post('/messages', request);
    return response.data;
  },

  editMessage: async (messageId: number, content: string): Promise<ChatMessage> => {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
  },

  deleteMessage: async (messageId: number): Promise<void> => {
    await api.delete(`/messages/${messageId}`);
  },

  // User status
  markMessageAsRead: async (messageId: number): Promise<void> => {
    await api.post(`/messages/${messageId}/read`);
  },

  getUnreadCount: async (): Promise<{ [key: number]: number }> => {
    const response = await api.get('/messages/unread/count');
    return response.data;
  }
};