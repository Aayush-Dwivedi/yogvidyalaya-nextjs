import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { StudentService } from '@/lib/services/student.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireSession(request);

    const dashboard = await StudentService.getStudentDashboard(session.userId);
    return ApiResponse.success(dashboard);
  } catch (error) {
    return handleRouteError(error);
  }
}
