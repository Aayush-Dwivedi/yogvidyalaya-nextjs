/**
 * Image optimization safety helper
 * Checks whether an image URL matches configured Next.js remotePatterns.
 * If the host is not configured or is a data/blob URL, unoptimized must be set to true
 * to prevent runtime Next.js Image component exceptions.
 */
export function isOptimizedUrl(src?: string | null): boolean {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) return true;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return false;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    return (
      host.endsWith('.supabase.co') ||
      host === 'images.unsplash.com' ||
      host === 'img.youtube.com' ||
      host === 'i.ytimg.com'
    );
  } catch {
    return false;
  }
}
