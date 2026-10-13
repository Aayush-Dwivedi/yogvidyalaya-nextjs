import type { MetadataRoute } from 'next';
import { getPublicSiteOrigin } from '@/lib/seo/site-url';

export default function robots(): MetadataRoute.Robots {
  const publicOrigin = getPublicSiteOrigin();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/student/',
        '/api/',
        '/design-system/',
      ],
    },
    ...(publicOrigin ? { sitemap: `${publicOrigin}/sitemap.xml` } : {}),
  };
}
