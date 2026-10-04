import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { VideoService } from '@/lib/services/video.service';
import { createVideoSchema, getVideosSchema } from '@/lib/validators/video.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const query = getVideosSchema.query.parse(rawQuery);

    const result = await VideoService.getVideos(query as any);
    return ApiResponse.paginated(result.items, result.meta);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const data = createVideoSchema.body.parse(body);

    const created = await VideoService.createVideo(data as any);
    return ApiResponse.created(created, 'Video created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
