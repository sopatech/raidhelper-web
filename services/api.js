import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  loginWithTwitch: () => {
    window.location.href = `${api.defaults.baseURL}/auth/login-twitch`;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
    }
  },
  
  refreshSession: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  }
};

// Raid animation API calls
export const raidAPI = {
  getAnimations: async () => {
    const response = await api.get('/raid/animations');
    return response.data;
  },
  
  getAnimation: async (id) => {
    const response = await api.get(`/raid/animations/${id}`);
    return response.data;
  },
  
  getAnimationPreview: async (id) => {
    const response = await api.get(`/raid/animations/${id}/preview`);
    return response.data;
  }
};

export default api;
