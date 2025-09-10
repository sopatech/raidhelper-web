import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface Animation {
  id: string;
  name: string;
  description: string;
  url: string;
  isActive: boolean;
}

export interface RaidEvent {
  id: string;
  fromUser: string;
  toUser: string;
  viewers: number;
  timestamp: string;
}

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  loginWithTwitch: (): void => {
    window.location.href = `${api.defaults.baseURL}/auth/login-twitch`;
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
    }
  },
  
  refreshSession: async (): Promise<any> => {
    const response: AxiosResponse = await api.post('/auth/refresh');
    return response.data;
  },
  
  getMe: async (): Promise<any> => {
    const response: AxiosResponse = await api.get('/users/me');
    return response.data;
  }
};

// Raid animation API calls
export const raidAPI = {
  getAnimations: async (): Promise<Animation[]> => {
    const response: AxiosResponse<Animation[]> = await api.get('/raid/animations');
    return response.data;
  },
  
  getAnimation: async (id: string): Promise<Animation> => {
    const response: AxiosResponse<Animation> = await api.get(`/raid/animations/${id}`);
    return response.data;
  },
  
  getAnimationPreview: async (id: string): Promise<any> => {
    const response: AxiosResponse = await api.get(`/raid/animations/${id}/preview`);
    return response.data;
  }
};

export default api;
