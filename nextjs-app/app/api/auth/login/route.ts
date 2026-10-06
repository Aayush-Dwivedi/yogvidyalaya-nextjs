import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { loginSchema } from '@/lib/validators/auth.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { setAuthCookies } from '@/lib/auth/token';
import { checkRateLimit, getClientIp } from '@/lib/utils/rateLimiter';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 'auth:login', 10, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return ApiResponse.error(
        `Too many login attempts. Please try again in ${Math.ceil(rateCheck.resetMs / 60000)} minutes.`,
        429
      );
    }

    const body = await request.json();
    const parsed = loginSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined;

    const { user, tokens } = await AuthService.login(email, password, userAgent, ipAddress);

    // Set tokens in HttpOnly cookies — eliminates localStorage XSS risk
    await setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return ApiResponse.success(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          profileImage: user.profileImage,
          bio: user.bio,
          city: user.city,
          experienceLevel: user.experienceLevel,
          lastLoginAt: user.lastLoginAt,
        },
      },
      'Login successful'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
