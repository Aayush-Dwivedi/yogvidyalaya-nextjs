import { type NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/utils/apiResponse';

export const runtime = 'nodejs';

/**
 * Student Registration Endpoint — Decommissioned.
 *
 * Kalptaru Yog Vidyalaya uses a public booking request flow.
 * Visitors do not need an account or login to book courses and workshops.
 */
export async function POST(_request: NextRequest) {
  return ApiResponse.error(
    'Student registration is decommissioned. Visitors may submit booking requests directly without creating an account.',
    410
  );
}
