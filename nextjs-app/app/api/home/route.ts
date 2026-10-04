import { connectDB } from '@/lib/db/mongoose';
import { HomeService } from '@/lib/services/home.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const content = await HomeService.getHomeContent();
    return ApiResponse.success(content, 'Home content aggregated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
