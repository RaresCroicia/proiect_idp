import axios from 'axios';

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
const COURSE_SERVICE_URL = import.meta.env.VITE_COURSE_SERVICE_URL;

console.log('Environment Variables:', {
  AUTH_SERVICE_URL,
  COURSE_SERVICE_URL,
  VITE_AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL,
  VITE_COURSE_SERVICE_URL: import.meta.env.VITE_COURSE_SERVICE_URL
});

// Create separate axios instances for each service
const authApi = axios.create({
  baseURL: AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const courseApi = axios.create({
  baseURL: COURSE_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add auth token and log requests
const addAuthToken = (config: any) => {
  console.log('Making request to:', config.baseURL + config.url);
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addAuthToken);
courseApi.interceptors.request.use(addAuthToken);

// Add response interceptor to handle errors
const handleError = (error: any) => {
  console.error('Request failed:', {
    url: error.config?.url,
    baseURL: error.config?.baseURL,
    fullURL: error.config?.baseURL + error.config?.url,
    status: error.response?.status,
    data: error.response?.data
  });
  
  // Only handle authentication errors for non-login requests
  if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
    console.log('Authentication error:', error.response?.data);
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Add response interceptor to log successful responses
const handleResponse = (response: any) => {
  console.log('Response:', {
    url: response.config.url,
    baseURL: response.config.baseURL,
    fullURL: response.config.baseURL + response.config.url,
    status: response.status,
    data: response.data,
  });
  return response;
};

authApi.interceptors.response.use(handleResponse, handleError);
courseApi.interceptors.response.use(handleResponse, handleError);

export { authApi, courseApi }; 