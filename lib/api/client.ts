import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '@/lib/utils/logger';

/**
 * API Client Configuration
 * Base axios instance with interceptors for authentication and error handling
 * Includes automatic token refresh mechanism
 */

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request Interceptor
 * Adds JWT token to all requests if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response scenarios and errors
 * Automatically refreshes token on 401 errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response data
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.clear();
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login?session=expired';
          return Promise.reject(error);
        }

        try {
          // Attempt to refresh token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Update tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Update cookie
          document.cookie = `token=${accessToken}; path=/; max-age=${60 * 15}; SameSite=Lax`;

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          isRefreshing = false;

          // Retry original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          isRefreshing = false;

          // Refresh failed, clear auth and redirect
          localStorage.clear();
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login?session=expired';

          return Promise.reject(refreshError);
        }
      }
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      logger.error('Rate limit exceeded:', {
        retryAfter,
        url: error.config?.url,
      });

      // Show user-friendly error message
      if (typeof window !== 'undefined') {
        const { toast } = await import('sonner');
        const seconds = retryAfter || 60;
        toast.error(
          `Terlalu banyak request. Silakan coba lagi dalam ${seconds} detik.`,
          { duration: 5000 }
        );
      }
    }

    // Handle other error scenarios
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 403:
          // Forbidden - user doesn't have permission
          logger.error('Access denied:', error.response.data);
          break;
        
        case 404:
          // Not found - only log as error if there's actual error message data
          if (error.response.data && Object.keys(error.response.data).length > 0) {
            logger.error('Resource not found:', error.response.data);
          } else {
            logger.warn('Resource not found (empty response):', error.config?.url);
          }
          break;
        
        case 500:
          // Server error
          logger.error('Server error:', error.response.data);
          break;
        
        default:
          logger.error('API error:', {
            status,
            data: error.response.data,
            url: error.config?.url,
            method: error.config?.method,
          });
      }
    } else if (error.request) {
      // Request made but no response received
      logger.error('Network error - no response received');
    } else {
      // Error in request setup
      logger.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
