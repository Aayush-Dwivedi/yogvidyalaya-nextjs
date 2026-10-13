/**
 * SEO Site URL & Origin Utilities
 *
 * Handles environment-safe public origin detection, normalization, and validation.
 * Ensures localhost and unverified development origins are never emitted in
 * production-facing sitemaps or metadata canonical URLs.
 */

const LOCALHOST_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
]);

/**
 * Validates and normalizes an input URL into an origin string without trailing paths or slashes.
 * Returns null if the URL is invalid or does not use http/https.
 */
export function normalizeOrigin(raw?: string | null): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Returns true if the given origin points to a localhost, loopback, or private development host.
 */
export function isLocalhostOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return (
      LOCALHOST_HOSTNAMES.has(hostname) ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    );
  } catch {
    return false;
  }
}

/**
 * Returns the configured public site origin if valid and not a localhost/loopback address.
 * Reads NEXT_PUBLIC_SITE_URL (preferred) with fallback to NEXT_PUBLIC_APP_URL.
 * If unset, invalid, or pointing to localhost, returns null.
 *
 * This ensures production sitemaps, robots sitemap references, and canonicals
 * NEVER emit localhost or unverified local development origins.
 */
export function getPublicSiteOrigin(): string | null {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    null;

  const normalized = normalizeOrigin(candidate);
  if (!normalized) return null;

  // Never treat localhost/loopback as a valid public site origin
  if (isLocalhostOrigin(normalized)) {
    return null;
  }

  return normalized;
}

/**
 * Returns the metadataBase URL for RootLayout metadata.
 *
 * - When a valid public site origin is configured, returns new URL(origin).
 * - In local development (NODE_ENV === 'development'), falls back to http://localhost:3000
 *   to allow Next.js to resolve relative asset URLs locally without warnings.
 * - In production without a configured public origin, returns undefined so Next.js
 *   does NOT hardcode localhost into production canonicals or Open Graph URLs.
 */
export function getMetadataBase(): URL | undefined {
  const publicOrigin = getPublicSiteOrigin();
  if (publicOrigin) {
    return new URL(publicOrigin);
  }

  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3000';
    return new URL(`http://localhost:${port}`);
  }

  return undefined;
}
