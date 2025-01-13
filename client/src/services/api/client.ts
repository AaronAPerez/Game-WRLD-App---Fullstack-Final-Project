
// import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// interface ApiError {
//   message: string;
//   status: number;
//   data?: any;
// }

// export class ApiClient {
//   private client: AxiosInstance;
//   private static instance: ApiClient;

//   private constructor() {
//     this.client = axios.create({
//       baseURL: import.meta.env.BASE_URL,
//       timeout: 10000,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     this.setupInterceptors();
//   }

//   public static getInstance(): ApiClient {
//     if (!ApiClient.instance) {
//       ApiClient.instance = new ApiClient();
//     }
//     return ApiClient.instance;
//   }

//   private setupInterceptors(): void {
//     // Request Interceptor
//     this.client.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => {
//         return Promise.reject(this.handleError(error));
//       }
//     );

//     // Response Interceptor
//     this.client.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;

//         // Handle token expiration and refresh
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
//           try {
//             const newToken = await this.refreshToken();
//             localStorage.setItem('token', newToken);
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return this.client(originalRequest);
//           } catch (refreshError) {
//             // Handle refresh token failure
//             localStorage.removeItem('token');
//             window.location.href = '/auth/login';
//             return Promise.reject(this.handleError(refreshError));
//           }
//         }

//         return Promise.reject(this.handleError(error));
//       }
//     );
//   }

//   private async refreshToken(): Promise<string> {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       const response = await this.client.post('/auth/refresh', { refreshToken });
//       return response.data.token;
//     } catch (error) {
//       throw new Error('Failed to refresh token');
//     }
//   }

//   private handleError(error: AxiosError): ApiError {
//     if (error.response) {
//       // Server responded with error status
//       return {
//         message: error.response.data?.message || 'Server error occurred',
//         status: error.response.status,
//         data: error.response.data,
//       };
//     } else if (error.request) {
//       // Request made but no response received
//       return {
//         message: 'No response received from server',
//         status: 503,
//       };
//     } else {
//       // Error setting up request
//       return {
//         message: error.message || 'An error occurred',
//         status: 500,
//       };
//     }
//   }

//   public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     const response = await this.client.get<T>(url, config);
//     return response.data;
//   }

//   public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     const response = await this.client.post<T>(url, data, config);
//     return response.data;
//   }

//   public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     const response = await this.client.put<T>(url, data, config);
//     return response.data;
//   }

//   public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     const response = await this.client.delete<T>(url, config);
//     return response.data;
//   }

//   public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     const response = await this.client.patch<T>(url, data, config);
//     return response.data;
//   }
// }