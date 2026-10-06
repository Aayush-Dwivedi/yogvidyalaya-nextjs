import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { HeroService } from '@/lib/services/hero.service';
import { updateHeroSlideSchema } from '@/lib/validators/hero.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { id } = await params;
    const body = await request.json();
    const parsed = updateHeroSlideSchema.body.safeParse(body);
    if (!parsed.success) return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    const slide = await HeroService.updateHeroSlide(id, parsed.data as any);
    return ApiResponse.success(slide, 'Hero slide updated');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { id } = await params;
    await HeroService.deleteHeroSlide(id);
    return ApiResponse.success(null, 'Hero slide deleted');
  } catch (error) {
    return handleRouteError(error);
  }
}
