/**
 * Helper to extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/live/eoc4SuC5mW8
 * - https://www.youtube.com/watch?v=eoc4SuC5mW8
 * - https://www.youtube.com/watch?feature=share&v=eoc4SuC5mW8
 * - https://youtu.be/eoc4SuC5mW8
 * - https://www.youtube.com/embed/eoc4SuC5mW8
 * - https://www.youtube.com/shorts/eoc4SuC5mW8
 * - Plain 11-character video ID
 */
export function extractYoutubeId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // If already an 11-character video ID
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches youtu.be/<id>, youtube.com/live/<id>, youtube.com/shorts/<id>, youtube.com/embed/<id>, youtube.com/v/<id>, youtube.com/watch?v=<id>, etc.
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|shorts\/|watch\?v=|watch\?.+?&v=))([\w-]{11})/i
  );
  if (match && match[1]) {
    return match[1];
  }

  // Fallback for &v= or ?v= in query parameters
  const paramMatch = trimmed.match(/[?&]v=([\w-]{11})/i);
  if (paramMatch && paramMatch[1]) {
    return paramMatch[1];
  }

  return null;
}

