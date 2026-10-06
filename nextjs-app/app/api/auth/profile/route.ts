import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AuthService } from '@/lib/services/auth.service';
import { updateProfileSchema } from '@/lib/validators/auth.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const session = await requireSession(request);
    const body = await request.json();

    const parsed = updateProfileSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const updatedUser = await AuthService.updateProfile(session.id, parsed.data as any);

    return ApiResponse.success(
      {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        city: updatedUser.city,
        address: updatedUser.address,
        experienceLevel: updatedUser.experienceLevel,
        emergencyContact: updatedUser.emergencyContact,
      },
      'Profile updated successfully'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
