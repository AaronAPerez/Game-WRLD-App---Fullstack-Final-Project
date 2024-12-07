import axios from 'axios';
import { BASE_URL } from '../constant';

export interface LoginResponse {
  token: string;
  userId: number;
  publisherName: string;
}

export interface CreateAccountDTO {
  id: number;
  username: string;
  password: string;
}

export interface LoginDTO {
  userName: string;
  password: string;
}

export interface UserIdDTO {
  userId: number;
  publisherName: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: LoginDTO): Promise<LoginResponse> {
    const response = await api.post('/User/Login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return {
        token: response.data.token,
        userId: response.data.userId,
        publisherName: response.data.publisherName
      };
    }
    throw new Error('Login failed');
  },

  async signup(userData: CreateAccountDTO): Promise<boolean> {
    const response = await api.post('/User/AddUsers', userData);
    return response.data;
  },

  async getUserById(id: number): Promise<UserIdDTO> {
    const response = await api.get(`/User/Profile`);
    return response.data;
  },

  async updateProfile(id: number, username: string): Promise<boolean> {
    const response = await api.put('/User/Profile', {
      username
    });
    return response.data;
  },

  async deleteAccount(username: string): Promise<boolean> {
    const response = await api.delete(`/User/Delete/${username}`);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;