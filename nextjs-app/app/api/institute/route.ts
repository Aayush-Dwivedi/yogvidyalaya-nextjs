import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { InstituteService } from '@/lib/services/institute.service';
import { updateInstituteSchema } from '@/lib/validators/institute.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const institute = await InstituteService.getInstitute();
    return ApiResponse.success(institute, 'Institute data retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const body = await request.json();
    const parsed = updateInstituteSchema.body.safeParse(body);
    if (!parsed.success) return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    const institute = await InstituteService.updateInstitute(parsed.data as any);
    return ApiResponse.success(institute, 'Institute data updated');
  } catch (error) {
    return handleRouteError(error);
  }
}
