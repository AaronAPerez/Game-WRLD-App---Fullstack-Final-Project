import axios from 'axios';
import { storage } from '@/utils/storage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5182/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clear();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;