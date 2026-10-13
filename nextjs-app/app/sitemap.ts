import type { MetadataRoute } from 'next';
import { getPublicSiteOrigin } from '@/lib/seo/site-url';

/**
 * Confirmed, canonical public routes approved for indexing.
 * Route aliases (such as /programs/*, /enquiry) and internal routes
 * (/admin, /student, /dashboard, /api, /login, /design-system) are excluded.
 */
const CONFIRMED_PUBLIC_ROUTES = [
  '/',
  '/about',
  '/about/founder',
  '/about/institute',
  '/courses',
  '/workshops',
  '/trainers',
  '/videos',
  '/gallery',
  '/contact',
  '/corporate',
  '/membership',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const publicOrigin = getPublicSiteOrigin();

  // If no valid, verified public origin is configured (or points to localhost),
  // return an empty sitemap to prevent emitting fake or localhost URLs into production.
  if (!publicOrigin) {
    return [];
  }

  return CONFIRMED_PUBLIC_ROUTES.map((route) => ({
    url: route === '/' ? publicOrigin : `${publicOrigin}${route}`,
  }));
}
