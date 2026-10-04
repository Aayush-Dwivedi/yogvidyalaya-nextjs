import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { InstituteService } from '@/lib/services/institute.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const updated = await InstituteService.updateInstitute({
      homepageCta: body,
    });
    return ApiResponse.success(updated.homepageCta, 'Homepage CTA updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
