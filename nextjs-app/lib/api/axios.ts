import axios, { AxiosResponse, AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<{ success?: boolean; message?: string }>) => {
    const customError = error.response?.data || {
      success: false,
      message: error.message || 'Network error encountered',
    };
    return Promise.reject(customError);
  }
);
