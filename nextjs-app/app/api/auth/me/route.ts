import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const session = await requireSession(request);
    const user = await AuthService.getCurrentUser(session.id);

    return ApiResponse.success(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        profileImage: user.profileImage,
        bio: user.bio,
        city: user.city,
        address: user.address,
        experienceLevel: user.experienceLevel,
        emergencyContact: user.emergencyContact,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
      'User profile retrieved'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
