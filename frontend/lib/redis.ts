import { Redis } from "@upstash/redis";

// Set these in .env.local (and in your Vercel project env vars):
//   UPSTASH_REDIS_REST_URL=https://YOUR-URL.upstash.io
//   UPSTASH_REDIS_REST_TOKEN=YOUR_TOKEN
//
// If either variable is absent (e.g. during local dev without a Redis instance),
// the module exports null so callers can safely skip Redis operations.

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set. " +
          "Redis features will be disabled."
      );
    }
    return null;
  }

  return Redis.fromEnv();
}

export const redis = createRedis();
