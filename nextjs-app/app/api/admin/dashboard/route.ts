import { connectDB } from '@/lib/db/mongoose';
import { AdminService } from '@/lib/services/admin.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const session = await requireAdminSession();
    const dashboard = await AdminService.getDashboardData();
    return ApiResponse.success(dashboard, 'Dashboard data retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}
