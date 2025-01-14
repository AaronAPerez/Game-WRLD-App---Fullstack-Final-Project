// src/services/authService.ts
import { useMutation } from '@tanstack/react-query';

import { storage } from '@/utils/storage';
import axiosInstance from './api/axiosConfig';

// Types
export interface LoginDTO {
  userName: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
}

export interface UserProfile {
  id: number;
  username: string;
  publisherName?: string;
}

// Auth Service
export const authService = {
  // Login
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/User/Login', {
        userName: credentials.userName,
        password: credentials.password
      });

      if (response.data.token) {
        storage.setToken(response.data.token);
        storage.setUser({
          id: response.data.userId,
          username: response.data.username
        });
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  },

  // Register
  register: async (data: RegisterDTO): Promise<void> => {
    try {
      await axiosInstance.post('/User/AddUsers', {
        username: data.username,
        password: data.password
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  },

  // Get User Profile
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    try {
      const response = await axiosInstance.get<UserProfile>(`/User/GetUserById/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch user profile');
    }
  },

  // Get User by Username
  getUserByUsername: async (username: string): Promise<UserProfile> => {
    try {
      const response = await axiosInstance.get<UserProfile>(`/User/GetUserByUsername/${username}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch user');
    }
  },

  // Update User Profile
  updateProfile: async (userId: number, data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await axiosInstance.post<UserProfile>('/User/UpdateUser', {
        id: userId,
        ...data
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  },

  // Delete User Account
  deleteAccount: async (username: string): Promise<void> => {
    try {
      await axiosInstance.post(`/User/DeleteUser/${username}`);
      storage.clear();
    } catch (error: any) {
      throw new Error('Failed to delete account');
    }
  },

  // Logout
  logout: () => {
    storage.clear();
  }
};

// React Query Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      storage.setToken(data.token);
      storage.setUser({
        id: data.userId,
        username: data.username
      });
    },
    onError: (error: Error) => {
      storage.clear();
      throw error;
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    onError: (error: Error) => {
      throw error;
    }
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: { userId: number; profile: Partial<UserProfile> }) =>
      authService.updateProfile(data.userId, data.profile),
    onSuccess: (data) => {
      // Update local storage user data if needed
      const currentUser = storage.getUser();
      if (currentUser && currentUser.id === data.id) {
        storage.setUser({
          ...currentUser,
          ...data
        });
      }
    }
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      storage.clear();
    }
  });
};

// Helper function to check authentication status
export const isAuthenticated = (): boolean => {
  const token = storage.getToken();
  const user = storage.getUser();
  return !!(token && user);
};

// Helper function to get current user
export const getCurrentUser = (): UserProfile | null => {
  return storage.getUser();
};