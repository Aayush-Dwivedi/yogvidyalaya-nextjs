import { ApiResponse } from '@/lib/utils/apiResponse';

export const runtime = 'nodejs';

/**
 * GET /api
 * Root API discovery and operational status endpoint.
 */
export async function GET() {
  return ApiResponse.success(
    {
      name: 'Kalptaruu Yoga Vidhyalaya Platform API',
      version: '1.0.0',
      status: 'operational',
      documentation: 'https://kalptaruyog.org',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        admin: '/api/admin',
        student: '/api/student',
        bookings: '/api/bookings',
        home: '/api/home',
        institute: '/api/institute',
        founders: '/api/founders',
        heroSlides: '/api/hero-slides',
        programs: '/api/programs',
        courses: '/api/courses',
        workshops: '/api/workshops',
        corporatePrograms: '/api/corporate-programs',
        membershipPlans: '/api/membership-plans',
        gallery: '/api/gallery',
        videos: '/api/videos',
        benefits: '/api/benefits',
        media: '/api/media',
      },
      timestamp: new Date().toISOString(),
    },
    'Kalptaruu Yoga Vidhyalaya Platform API Root'
  );
}
