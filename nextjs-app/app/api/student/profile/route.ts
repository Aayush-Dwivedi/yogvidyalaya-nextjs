import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { updateProfileSchema } from '@/lib/validators/auth.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireStudentSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireStudentSession(request);
    const user = await AuthService.getUserById(session.userId);
    return ApiResponse.success(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireStudentSession(request);

    const body = await request.json();
    const data = updateProfileSchema.body.parse(body);

    const updated = await AuthService.updateProfile(session.userId, data as any);
    return ApiResponse.success(updated, 'Profile updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
