import { getPublicSiteOrigin } from './site-url';

/**
 * Generates EducationalOrganization Schema.org JSON-LD structured data.
 * Uses only verified institute data from the project:
 * - Official name: Kalptaruu Yoga Vidhyalaya (alternate: Kalptaru Yog Vidyalaya)
 * - Verified public email: shuchimohan@kalptaruyogvidyalaya.com
 * - Verified public phone: +919818047984
 * - Verified physical address: N114 Piyush Heights, Sector 89, Faridabad, Haryana 121002, IN
 *
 * Public origin and logo URLs are conditionally included ONLY when a valid
 * public site origin is configured (never emits localhost).
 */
export function getOrganizationSchema(): Record<string, unknown> {
  const origin = getPublicSiteOrigin();

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Kalptaruu Yoga Vidhyalaya',
    alternateName: 'Kalptaru Yog Vidyalaya',
    description:
      'Authentic classical yoga institute providing foundational courses, workshops, and teacher training in the traditional lineage of Patanjali and the ancient Natha tradition.',
    email: 'shuchimohan@kalptaruyogvidyalaya.com',
    telephone: '+919818047984',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'N114 Piyush Heights, Sector 89',
      addressLocality: 'Faridabad',
      addressRegion: 'Haryana',
      postalCode: '121002',
      addressCountry: 'IN',
    },
  };

  if (origin) {
    schema.url = origin;
    schema.logo = `${origin}/logo.png`;
  }

  return schema;
}

/**
 * Generates WebSite Schema.org JSON-LD structured data.
 * SearchAction is intentionally omitted because the site does not have
 * a dedicated public search endpoint.
 */
export function getWebSiteSchema(): Record<string, unknown> {
  const origin = getPublicSiteOrigin();

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kalptaru Yog Vidyalaya',
    alternateName: 'Kalptaruu Yoga Vidhyalaya',
  };

  if (origin) {
    schema.url = origin;
  }

  return schema;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Generates BreadcrumbList Schema.org JSON-LD structured data for interior pages.
 * Item URLs are only included when a valid public site origin is configured.
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  const origin = getPublicSiteOrigin();

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const listItem: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };

      if (origin) {
        const cleanPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
        listItem.item = `${origin}${cleanPath}`;
      }

      return listItem;
    }),
  };
}
