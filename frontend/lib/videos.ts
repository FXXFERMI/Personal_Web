import { getRedis } from "@/lib/redis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VideoProvider = "mux" | "cloudflare" | "external";

export type PageVideo = {
  /** Hosting provider for the video. */
  provider: VideoProvider;
  /**
   * Mux / Cloudflare playback ID.
   * Required when provider is "mux" or "cloudflare".
   */
  playbackId?: string;
  /**
   * Direct video URL.
   * Required when provider is "external".
   */
  url?: string;
  /** Human-readable title shown as the video label / aria-label. */
  title: string;
  /** Optional poster/thumbnail URL shown before the video plays. */
  poster?: string;
  /** Set to false to hide the video without deleting the Redis key. */
  enabled: boolean;
};

// ---------------------------------------------------------------------------
// Redis key schema
//   video:<page>:<locale>
//   e.g.  video:home:en   video:home:zh
//         video:about:en  video:projects:zh
// ---------------------------------------------------------------------------

function videoKey(page: string, locale: "en" | "zh"): string {
  return `video:${page}:${locale}`;
}

// ---------------------------------------------------------------------------
// Fetch helper (server-side only)
// ---------------------------------------------------------------------------

/**
 * Retrieve the video configuration for a given page + locale from Redis.
 *
 * Returns `null` when:
 *  - Redis is not configured (missing env vars)
 *  - No key exists for this page/locale
 *  - The config has `enabled: false`
 *  - Any unexpected error occurs (error is logged server-side)
 */
export async function getPageVideo(
  page: string,
  locale: "en" | "zh"
): Promise<PageVideo | null> {
  try {
    const key = videoKey(page, locale);
    const redis = getRedis();
    // @upstash/redis returns the parsed JSON value directly when it was stored
    // as a JSON string via set(key, JSON.stringify(value)).
    const raw = await redis.get<PageVideo>(key);

    if (!raw || !raw.enabled) {
      return null;
    }

    return raw;
  } catch {
    return null;
  }
}
