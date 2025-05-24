import { LOCALSTORAGE_KEYS } from '@/lib/constants';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Request_Source': import.meta.env.VITE_CLIENT_URL
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest?._retry && 
        window.localStorage.getItem(LOCALSTORAGE_KEYS.AUTHENTICATED) === 'true') {
      originalRequest._retry = true;
      
      try {
        await axios.get(`${import.meta.env.VITE_API_SERVER_BASE_URL}/api/refreshToken`, {
            withCredentials: true,
            headers: {
                'X-Request_Source': import.meta.env.VITE_CLIENT_URL
            }
        });

        return api(originalRequest);
      } catch (refreshError) {
        window.localStorage.setItem(LOCALSTORAGE_KEYS.AUTHENTICATED, 'false')
        window.location.reload()
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic request method
const request = async <T>(config: InternalAxiosRequestConfig): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// HTTP Methods
export const http = {
  get: <T>(url: string, config?: InternalAxiosRequestConfig) => 
    request<T>({ ...config, method: 'GET', url }),
    
  post: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),
    
  put: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),
    
  patch: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),
    
  delete: <T>(url: string, config?: InternalAxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
};

export default http;
