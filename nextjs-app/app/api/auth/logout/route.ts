import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';
import { clearAuthCookies, getRefreshTokenFromCookies } from '@/lib/auth/token';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await requireSession(request);
    const refreshToken = await getRefreshTokenFromCookies();

    await AuthService.logout(session.id, refreshToken ?? undefined);
    await clearAuthCookies();

    return ApiResponse.success(null, 'Logged out successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
