import { connectDB } from '@/lib/db/mongoose';
import { HomeService } from '@/lib/services/home.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const content = await HomeService.getHomeContent();
    const res = ApiResponse.success(content, 'Home content aggregated successfully');
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (error) {
    return handleRouteError(error);
  }
}
