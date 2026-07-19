import { Redis } from "@upstash/redis";

// Set these in .env.local (and in your Vercel project env vars):
//   UPSTASH_REDIS_REST_URL=https://YOUR-URL.upstash.io
//   UPSTASH_REDIS_REST_TOKEN=YOUR_TOKEN
//
// Redis is initialised lazily (on first call) so that importing this module
// during the Next.js build does NOT evaluate the env vars and trigger an error.

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Missing Upstash Redis environment variables.");
  }

  if (!url.startsWith("https://")) {
    throw new Error("UPSTASH_REDIS_REST_URL must start with https://");
  }

  _redis = new Redis({ url, token });
  return _redis;
}
