import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AppConfig } from '../lib/ConfigContext';

// Create a function to create axios instance with dynamic config
export const createApiInstance = (config: AppConfig): AxiosInstance => {
  const api: AxiosInstance = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth headers
  api.interceptors.request.use(
    (config) => {
      // Check if we're in the browser before accessing localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('session_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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
        // Check if we're in the browser before accessing localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('session_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

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

// Authentication API calls
export const createAuthAPI = (config: AppConfig) => {
  const api = createApiInstance(config);
  
  return {
    loginWithTwitch: (): void => {
      // Build Twitch OAuth URL in the frontend
      const twitchAuthURL = `https://id.twitch.tv/oauth2/authorize?client_id=${config.twitchClientId}&redirect_uri=${encodeURIComponent(config.twitchRedirectUri)}&response_type=code&scope=user:read:email`;
      window.location.href = twitchAuthURL;
    },
    
    logout: async (): Promise<void> => {
      try {
        await api.post('/auth/logout');
      } finally {
        // Check if we're in the browser before accessing localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('session_token');
          localStorage.removeItem('user');
        }
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
};

// Raid animation API calls
export const createRaidAPI = (config: AppConfig) => {
  const api = createApiInstance(config);
  
  return {
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
};
