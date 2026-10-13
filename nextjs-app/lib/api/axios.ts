import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache-busting request interceptor for live CMS reflection
apiClient.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() === 'get') {
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError<{ success?: boolean; message?: string }>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!error.response || !originalRequest) {
      const customError = error.response?.data || {
        success: false,
        message: error.message || 'Network error encountered',
      };
      return Promise.reject(customError);
    }

    const status = error.response.status;
    const url = originalRequest.url || '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/refresh-token') ||
      url.includes('/auth/logout');

    const hasSessionCookie =
      typeof document !== 'undefined' &&
      document.cookie.split('; ').some((row) => row.startsWith('kalptaru_session='));

    // On 401 from protected routes, attempt silent token refresh ONLY if a session exists
    if (status === 401 && !originalRequest._retry && !isAuthRoute && hasSessionCookie) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/auth/refresh');
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear session indicator on failed refresh to prevent repeated retry loops
        if (typeof document !== 'undefined') {
          document.cookie = 'kalptaru_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        processQueue(refreshError);
        return Promise.reject(
          error.response?.data || {
            success: false,
            message: 'Session expired. Please log in again.',
          }
        );
      } finally {
        isRefreshing = false;
      }
    }

    const customError = error.response?.data || {
      success: false,
      message: error.message || 'Network error encountered',
    };
    return Promise.reject(customError);
  }
);

