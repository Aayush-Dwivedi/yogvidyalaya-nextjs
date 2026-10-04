import { NextResponse } from 'next/server';

/**
 * Standardised API response helpers for Next.js Route Handlers.
 * Replaces the Express-based ApiResponse utility.
 */

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: ApiMeta;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(
    data: T,
    message = 'Success',
    status = 200,
    meta?: ApiMeta
  ): NextResponse<ApiResponseBody<T>> {
    return NextResponse.json(
      { success: true, message, data, meta, timestamp: new Date().toISOString() },
      { status }
    );
  }

  static created<T>(
    data: T,
    message = 'Created successfully'
  ): NextResponse<ApiResponseBody<T>> {
    return NextResponse.json(
      { success: true, message, data, timestamp: new Date().toISOString() },
      { status: 201 }
    );
  }

  static paginated<T>(
    data: T,
    meta?: ApiMeta,
    message = 'Success'
  ): NextResponse<ApiResponseBody<T>> {
    return NextResponse.json(
      { success: true, message, data, meta, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  }

  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }

  static error(
    message: string,
    status = 500,
    errors?: unknown
  ): NextResponse<ApiResponseBody<null>> {
    return NextResponse.json(
      { success: false, message, data: null, errors, timestamp: new Date().toISOString() },
      { status }
    );
  }

  static unauthorized(message = 'Authentication required'): NextResponse {
    return ApiResponse.error(message, 401);
  }

  static forbidden(message = 'Access forbidden'): NextResponse {
    return ApiResponse.error(message, 403);
  }

  static notFound(message = 'Resource not found'): NextResponse {
    return ApiResponse.error(message, 404);
  }

  static badRequest(message: string, errors?: unknown): NextResponse {
    return ApiResponse.error(message, 400, errors);
  }

  static conflict(message: string): NextResponse {
    return ApiResponse.error(message, 409);
  }
}

/**
 * Convert an AppError or generic Error to a structured API response.
 */
export function handleRouteError(error: unknown): NextResponse {
  // Handle AppError (from lib/utils/appError.ts)
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const appError = error as { statusCode: number; message: string };
    return ApiResponse.error(appError.message, appError.statusCode);
  }

  // Handle thrown string errors from requireSession/requireAdminSession
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') return ApiResponse.unauthorized();
    if (error.message === 'FORBIDDEN') return ApiResponse.forbidden();
    return ApiResponse.error(error.message, 500);
  }

  return ApiResponse.error('An unexpected error occurred', 500);
}
