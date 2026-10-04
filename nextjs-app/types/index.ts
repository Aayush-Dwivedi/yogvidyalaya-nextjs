/**
 * Standard API response envelope received from backend
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
  timestamp: string;
}

export interface HealthCheckData {
  status: 'healthy' | 'degraded';
  service: string;
  environment: string;
  uptimeSeconds: number;
  database: {
    status: string;
    connected: boolean;
  };
  storageProvider: string;
  timestamp: string;
}
