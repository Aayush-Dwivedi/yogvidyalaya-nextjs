import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { AdminService } from '@/lib/services/admin.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireAdminSession(request);
    const dashboard = await AdminService.getDashboardData();
    return ApiResponse.success(dashboard, 'Dashboard data retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}
