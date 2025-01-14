import type { LoginDTO, CreateAccountDTO, ApiResponse, UserIdDTO } from '@/types/api';
import axiosInstance from './api/axiosConfig';



export const authService = {
  login: async (credentials: LoginDTO) => {
    const { data } = await axiosInstance.post<ApiResponse<{ token: string }>>(
      '/User/Login',
      credentials
    );
    return data;
  },

  register: async (userData: CreateAccountDTO) => {
    const { data } = await axiosInstance.post<ApiResponse<void>>(
      '/User/AddUsers',
      userData
    );
    return data;
  },

  getUserByUsername: async (username: string) => {
    const { data } = await axiosInstance.get<ApiResponse<UserIdDTO>>(
      `/User/GetUserByUsername/${username}`
    );
    return data;
  }
};



