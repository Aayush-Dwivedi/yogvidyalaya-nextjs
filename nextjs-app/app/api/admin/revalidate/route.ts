import { type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth/session';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession(request);

    // Invalidate root layout and all derived page caches
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');
    revalidatePath('/courses', 'page');
    revalidatePath('/workshops', 'page');
    revalidatePath('/about', 'page');
    revalidatePath('/about/founder', 'page');
    revalidatePath('/about/institute', 'page');
    revalidatePath('/programs', 'page');
    revalidatePath('/programs/trainers', 'page');
    revalidatePath('/gallery', 'page');
    revalidatePath('/videos', 'page');
    revalidatePath('/contact', 'page');
    revalidatePath('/enquiry', 'page');

    return ApiResponse.success(
      { revalidated: true, timestamp: Date.now() },
      'All changes confirmed and published. Public site cache purged.'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
