import type { Metadata } from 'next';
import { getPublicSiteOrigin } from './site-url';

const DEFAULT_OG_IMAGE = '/images/welcome-cleansing.jpg';

export interface PageMetadataInput {
  title: string | { absolute: string };
  description: string;
  pathname?: string;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Creates standardized, environment-safe page metadata for Next.js App Router pages.
 *
 * - Canonical URLs and Open Graph URLs are generated ONLY when a valid, verified
 *   public site origin is configured (via NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_APP_URL).
 * - When origin is unset or localhost, canonical and absolute OG URLs are omitted,
 *   preventing localhost or placeholder domains from being baked into production output.
 * - Social card images use existing public assets and only format absolute URLs when
 *   a public origin is verified.
 */
export function createPageMetadata({
  title,
  description,
  pathname,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
}: PageMetadataInput): Metadata {
  if (noindex) {
    return {
      title,
      description,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const origin = getPublicSiteOrigin();
  const canonicalUrl =
    origin && pathname
      ? `${origin}${pathname === '/' ? '' : pathname.startsWith('/') ? pathname : `/${pathname}`}`
      : undefined;

  const fullOgTitle =
    typeof title === 'string'
      ? `${title} | Kalptaruu Yoga Vidhyalaya`
      : title.absolute;

  const fullImageUrl =
    origin && ogImage
      ? `${origin}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`
      : undefined;

  return {
    title,
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title: fullOgTitle,
      description,
      type: 'website',
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(fullImageUrl
        ? {
            images: [
              {
                url: fullImageUrl,
                width: 1200,
                height: 630,
                alt: 'Kalptaruu Yoga Vidhyalaya',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullOgTitle,
      description,
      ...(fullImageUrl ? { images: [fullImageUrl] } : {}),
    },
  };
}
