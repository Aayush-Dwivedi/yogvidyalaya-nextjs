import { type NextRequest } from 'next/server';
import { POST as refreshHandler } from '../refresh/route';

export const runtime = 'nodejs';

/**
 * POST /api/auth/refresh-token
 * Compatibility alias for /api/auth/refresh
 */
export async function POST(request: NextRequest) {
  return refreshHandler(request);
}
