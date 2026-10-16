/**
 * Utility to convert normal Google Maps URLs into an embeddable iframe URL.
 * Falls back to verified institutional location if no custom URL has been set in CMS.
 */
export const DEFAULT_MAP_SEARCH_QUERY = 'N114 Piyush Heights, Sector 89, Faridabad, Haryana 121002';
export const DEFAULT_MAP_DIRECT_URL = 'https://maps.google.com/?q=N114+Piyush+Heights,+Sector+89,+Faridabad+121002';

export function getMapDirectUrl(rawUrl?: string, fallbackUrl: string = DEFAULT_MAP_DIRECT_URL): string {
  const trimmed = (rawUrl || '').trim();
  return trimmed || fallbackUrl;
}

export function getMapEmbedUrl(rawUrl?: string, fallbackQuery: string = DEFAULT_MAP_SEARCH_QUERY): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    if (!fallbackQuery) return '';
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // 1. If it's already an embed URL or has output=embed
  if (trimmed.includes('/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }

  // 2. If it's an iframe code by any chance, extract src attribute
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);

    // Check query params (?q=... or ?query=...)
    const q = parsed.searchParams.get('q') || parsed.searchParams.get('query');
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    // Check place name in path /maps/place/NAME/...
    const placeMatch = parsed.pathname.match(/\/place\/([^/@]+)/);
    if (placeMatch && placeMatch[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    // Check search in path /maps/search/QUERY
    const searchMatch = parsed.pathname.match(/\/search\/([^/@]+)/);
    if (searchMatch && searchMatch[1]) {
      const searchQuery = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    // Check cid (Google Maps Customer ID / Business ID)
    const cid = parsed.searchParams.get('cid');
    if (cid) {
      return `https://maps.google.com/maps?cid=${encodeURIComponent(cid)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    // If it's on google maps domain, append output=embed
    if (parsed.hostname.includes('google') && parsed.hostname.includes('maps')) {
      parsed.searchParams.set('output', 'embed');
      return parsed.toString();
    }
  } catch {}

  // If plain place name or query string was entered
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}
