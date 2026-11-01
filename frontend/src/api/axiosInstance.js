import axios from 'axios';

// Automatically supports both VITE_API_URL and VITE_API_BASE_URL
const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

// Normalize URL: trim whitespace, strip trailing slashes, ensure it ends with /api
export const getCleanBaseURL = (url) => {
  if (!url) return 'http://localhost:5000/api';
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`;
  }
  return cleaned;
};

export const resolvedBaseURL = getCleanBaseURL(rawBaseURL);

export const axiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to inject Authorization Bearer token when available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sparkle_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Clear token if 401 unauthorized
      localStorage.removeItem('sparkle_admin_token');
    }
    return Promise.reject(error);
  }
);
