import axios from 'axios';
import { storage } from '@/utils/storage';
import { API_KEY } from '../gameService';

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


// Add interceptors to axios instance
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      const retryCount = (error.config.retryCount || 0) + 1;
      const maxRetries = 3;
      
      if (retryCount <= maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        error.config.retryCount = retryCount;
        await new Promise(resolve => setTimeout(resolve, delay));
        return axiosInstance(error.config);
      }
    }
    
    const errorMessage = error.response?.data?.error 
      || error.message 
      || 'An unknown error occurred';

    const enhancedError = new Error(errorMessage);
    error.config = error.config;
    error.response = error.response;
    
    throw enhancedError;
  }
);

axiosInstance.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key: API_KEY
  };
  return config;
});


export default axiosInstance;