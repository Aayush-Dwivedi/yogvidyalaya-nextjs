import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { HeroService } from '@/lib/services/hero.service';
import { createHeroSlideSchema, updateHeroSlideSchema } from '@/lib/validators/hero.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const slides = await HeroService.getHeroSlides(activeOnly);
    const res = ApiResponse.success(slides, 'Hero slides retrieved');
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const body = await request.json();
    const parsed = createHeroSlideSchema.body.safeParse(body);
    if (!parsed.success) return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    const slide = await HeroService.createHeroSlide(parsed.data as any);
    return ApiResponse.created(slide, 'Hero slide created');
  } catch (error) {
    return handleRouteError(error);
  }
}
