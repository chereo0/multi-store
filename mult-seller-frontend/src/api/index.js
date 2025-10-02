import axios from 'axios';
import toast from 'react-hot-toast';

// Resolve base URL to work smoothly with XAMPP (Apache on localhost)
const resolveBaseURL = () => {
  // 1) Prefer explicit env var
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl && typeof envUrl === 'string') {
    return envUrl.replace(/\/$/, '');
  }

  // 2) Infer same-host XAMPP default like http://localhost/api
  try {
    const protocol = typeof window !== 'undefined' && window.location?.protocol ? window.location.protocol : 'http:';
    const host = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : 'localhost';
    return `${protocol}//${host}/api`;
  } catch (_e) {
    // 3) Fallback
    return 'http://localhost/api';
  }
};

// Create axios instance with default configuration
const api = axios.create({
  baseURL: resolveBaseURL(),

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Request timeout (30 seconds)
  timeout: 30000,
});

// Request interceptor - runs before each request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (if available)
    const token = localStorage.getItem('auth_token');
    const clientToken = localStorage.getItem('client_token');
    const urlString = typeof config.url === 'string' ? config.url : '';
    const isTokenRequest = urlString.includes('/oauth2/token');
    
    // Add authorization header if token exists
    if (!isTokenRequest && token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isTokenRequest && clientToken) {
      config.headers.Authorization = `Bearer ${clientToken}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        url: response.config.url,
      });
    }
    
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle specific HTTP status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          toast.error('Session expired. Please login again.');
          // You can add redirect logic here if needed
          break;
          
        case 403:
          // Forbidden
          toast.error('Access denied. You don\'t have permission to perform this action.');
          break;
          
        case 404:
          // Not found
          toast.error('Requested resource not found.');
          break;
          
        case 422:
          // Validation errors
          if (data.errors) {
            // Handle Laravel validation errors
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.forEach(message => toast.error(message));
          } else {
            toast.error(data.message || 'Validation failed.');
          }
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          toast.error(data.message || `Request failed with status ${status}`);
      }
      
      console.error('API Error Response:', {
        status,
        data,
        url: error.config?.url,
      });
      
    } else if (error.request) {
      // Network error - request was made but no response received
      console.error('Network Error:', error.request);
      toast.error('Network error. Please check your internet connection.');
      
    } else {
      // Something else happened
      console.error('Error:', error.message);
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API operations

/**
 * Make a GET request
 * @param {string} url - The endpoint URL
 * @param {object} config - Additional axios config
 * @returns {Promise} Axios response
 */
export const get = (url, config = {}) => api.get(url, config);

/**
 * Make a POST request
 * @param {string} url - The endpoint URL
 * @param {object} data - Request data
 * @param {object} config - Additional axios config
 * @returns {Promise} Axios response
 */
export const post = (url, data = {}, config = {}) => api.post(url, data, config);

/**
 * Make a PUT request
 * @param {string} url - The endpoint URL
 * @param {object} data - Request data
 * @param {object} config - Additional axios config
 * @returns {Promise} Axios response
 */
export const put = (url, data = {}, config = {}) => api.put(url, data, config);

/**
 * Make a PATCH request
 * @param {string} url - The endpoint URL
 * @param {object} data - Request data
 * @param {object} config - Additional axios config
 * @returns {Promise} Axios response
 */
export const patch = (url, data = {}, config = {}) => api.patch(url, data, config);

/**
 * Make a DELETE request
 * @param {string} url - The endpoint URL
 * @param {object} config - Additional axios config
 * @returns {Promise} Axios response
 */
export const del = (url, config = {}) => api.delete(url, config);

/**
 * Upload file with progress tracking
 * @param {string} url - The endpoint URL
 * @param {FormData} formData - Form data containing file
 * @param {function} onProgress - Progress callback function
 * @returns {Promise} Axios response
 */
export const upload = (url, formData, onProgress) => {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Clear authentication token
 */
export const clearAuthToken = () => {
  setAuthToken(null);
};

/**
 * Get current authentication token
 * @returns {string|null} Current token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Export the configured axios instance
export default api;

// Export all HTTP methods for convenience
export { api };
