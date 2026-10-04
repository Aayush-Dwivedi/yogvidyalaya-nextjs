import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { registerStudentSchema } from '@/lib/validators/auth.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { setAuthCookies } from '@/lib/auth/token';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = registerStudentSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const userAgent = request.headers.get('user-agent') ?? undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined;

    const { user, tokens } = await AuthService.registerStudent(
      parsed.data,
      userAgent,
      ipAddress
    );

    await setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return ApiResponse.created(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          profileImage: user.profileImage,
        },
      },
      'Account created successfully. Welcome to Kalptaru Yog Vidyalaya!'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
