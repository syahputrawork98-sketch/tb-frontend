import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Request: Inject JWT Token from Cookie
api.interceptors.request.use(
  (config) => {
    // JANGAN kirim token jika ini adalah permintaan LOGIN
    if (config.url?.includes('/auth/login')) {
      return config;
    }

    if (typeof window !== 'undefined') {
      const token = Cookies.get('tb_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for Response: Handle Unauthorized (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear all session data
        Cookies.remove('tb_token', { path: '/' });
        Cookies.remove('tb_role', { path: '/' });
        localStorage.removeItem('tb-auth-storage');
        
        // Redirect once
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
