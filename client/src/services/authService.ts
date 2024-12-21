import axios from 'axios';

import { CreateAccountDTO, LoginDTO, LoginResponse, TokenRefreshResponse, UserIdDTO } from '../types';
import { BASE_URL } from '../constants';


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests automatically
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post<TokenRefreshResponse>(
          `${BASE_URL}/User/RefreshToken`, 
          { token }
        );

        const { token: newToken, userId, username } = response.data;

        // Update local storage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify({ token: newToken, userId, username }));

        // Update authorization header
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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