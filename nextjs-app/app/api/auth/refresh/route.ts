import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { getRefreshTokenFromCookies, setAuthCookies } from '@/lib/auth/token';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const refreshToken = await getRefreshTokenFromCookies();
    if (!refreshToken) {
      return ApiResponse.unauthorized('No refresh token found. Please log in again.');
    }

    const userAgent = request.headers.get('user-agent') ?? undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined;

    const newTokens = await AuthService.refreshTokens(refreshToken, userAgent, ipAddress);

    // Rotate: set new HttpOnly cookies
    await setAuthCookies(newTokens.accessToken, newTokens.refreshToken);

    return ApiResponse.success(null, 'Session refreshed successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
