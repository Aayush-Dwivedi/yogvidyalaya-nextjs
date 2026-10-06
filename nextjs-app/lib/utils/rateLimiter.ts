import { type NextRequest } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding-window store
const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipStore.entries()) {
    // Retain only timestamps within the last hour
    const recent = record.timestamps.filter((ts) => now - ts < 3600000);
    if (recent.length === 0) {
      ipStore.delete(key);
    } else {
      record.timestamps = recent;
    }
  }
}, 600000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Checks whether an incoming request exceeds the specified rate limit.
 *
 * @param ip Client IP address
 * @param bucket Identifies the rate limited action (e.g. 'auth:login')
 * @param maxRequests Maximum allowed attempts within the window
 * @param windowMs Duration of the window in milliseconds (default: 15 minutes)
 */
export function checkRateLimit(
  ip: string,
  bucket: string,
  maxRequests = 10,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = ipStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    ipStore.set(key, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, oldest + windowMs - now);
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Extracts client IP from Next.js request headers
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
