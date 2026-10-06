import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { WorkshopService } from '@/lib/services/workshop.service';
import { createWorkshopSchema, updateWorkshopSchema } from '@/lib/validators/workshop.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/workshops — public list
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = {
      status: searchParams.get('status') || 'published',
      featured: searchParams.get('featured') || undefined,
      mode: searchParams.get('mode') || undefined,
      search: searchParams.get('search') || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
      sort: searchParams.get('sort') || undefined,
    };
    const result = await WorkshopService.getWorkshops(query as any);
    const res = ApiResponse.paginated(result.items, result.meta, 'Workshops retrieved');
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/workshops — admin only
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const parsed = createWorkshopSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const workshop = await WorkshopService.createWorkshop(parsed.data as any);
    return ApiResponse.created(workshop, 'Workshop created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
