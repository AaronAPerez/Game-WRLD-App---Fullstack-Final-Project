import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from '.././constants';
import type { 
  ChatRoom, 
  ChatMessage, 
  DirectMessage, 
<<<<<<< HEAD
  SendMessageRequest 
=======
  SendMessageRequest, 
  DirectMessageDTO
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
} from '../types/index';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ChatService {
  getDirectMessages: (userId: number) => Promise<DirectMessageDTO[]>;
  sendDirectMessage: (userId: number, content: string) => Promise<DirectMessageDTO>;
  sendTypingStatus: (userId: number, isTyping: boolean) => Promise<void>;
}

export const chatService = {
  
  // Chat Rooms
  async getRooms(): Promise<ChatRoom[]> {
    const response = await api.get(API_ENDPOINTS.CHAT.ROOMS);
    return response.data;
  },

  async createRoom(data: { name: string; description?: string; isPrivate?: boolean }): Promise<ChatRoom> {
    const response = await api.post(API_ENDPOINTS.CHAT.ROOMS, data);
    return response.data;
  },

  async getRoomMessages(roomId: number, page = 1, pageSize = 50): Promise<ChatMessage[]> {
    const response = await api.get(API_ENDPOINTS.CHAT.ROOM_MESSAGES(roomId), {
      params: { page, pageSize }
    });
    return response.data;
  },

  async joinRoom(roomId: number): Promise<boolean> {
    const response = await api.post(API_ENDPOINTS.CHAT.ROOM_JOIN(roomId));
    return response.data;
  },

  async leaveRoom(roomId: number): Promise<boolean> {
    const response = await api.post(API_ENDPOINTS.CHAT.ROOM_LEAVE(roomId));
    return response.data;
  },

  // Direct Messages
  async startDirectMessage(receiverId: number): Promise<DirectMessage> {
    const response = await api.post(API_ENDPOINTS.CHAT.DIRECT_START, { receiverId });
    return response.data;
  },

  async getDirectMessages(userId: number, page = 1, pageSize = 50): Promise<DirectMessage[]> {
    const response = await api.get(API_ENDPOINTS.CHAT.DIRECT_MESSAGES(userId), {
      params: { page, pageSize }
    });
    return response.data;
  },

  async sendDirectMessage(data: SendMessageRequest): Promise<DirectMessage> {
    const response = await api.post(API_ENDPOINTS.CHAT.DIRECT_SEND, data);
    return response.data;
  },

  // Message Actions
  async markMessageAsRead(messageId: number): Promise<void> {
    await api.post(`/messages/${messageId}/read`);
  },
}
//   // async getUnreadMessagesCount(): Promise<Record<number, number>> {
//   //   const response = await api.get('/messages/unread/count');
//   //   return response.data;
//   // }
// };
