import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { HeroService } from '@/lib/services/hero.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    await HeroService.reorderHeroSlides(Array.isArray(body) ? body : body.slides || []);
    return ApiResponse.success(null, 'Hero slides reordered successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
