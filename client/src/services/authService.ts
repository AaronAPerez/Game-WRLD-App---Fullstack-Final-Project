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

// interceptor to automatically add auth token to requests
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
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // Get user details after successful login
      const userDetails = await this.getUserByUsername(credentials.userName);
      return {
        token: response.data.token,
        userId: userDetails.userId,
        publisherName: userDetails.publisherName
      };
    }
    throw new Error('Login failed');
  },

  async signup(userData: CreateAccountDTO): Promise<boolean> {
    const response = await api.post('/User/AddUsers', userData);
    return response.data;
  },

  async getUserByUsername(username: string): Promise<UserIdDTO> {
    const response = await api.get(`/User/GetUserByUsername/${username}`);
    return response.data;
  },

  async updateUser(id: number, username: string): Promise<boolean> {
    const response = await api.post('/User/UpdateUser', null, {
      params: { id, username }
    });
    return response.data;
  },

  async deleteUser(username: string): Promise<boolean> {
    const response = await api.post(`/User/DeleteUser/${username}`);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};


export default authService;