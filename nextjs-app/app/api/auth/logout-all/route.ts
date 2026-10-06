import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';
import { clearAuthCookies } from '@/lib/auth/token';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await requireSession(request);
    await AuthService.logoutAll(session.id);
    await clearAuthCookies();

    return ApiResponse.success(null, 'Logged out from all devices successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
