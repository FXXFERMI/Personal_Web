/**
 * Seed script — populate Redis with sample video configurations.
 *
 * Usage (from the `frontend/` directory):
 *
 *   npx tsx scripts/seed-videos.ts
 *
 * Prerequisites:
 *   - UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in
 *     .env.local (or exported as environment variables).
 *   - tsx must be available: npm install -D tsx  (or npx tsx works without installing)
 *
 * To update an existing video, edit the values below and re-run the script.
 * To disable a video without deleting it, set `enabled: false`.
 * To delete a video key entirely, use: redis.del("video:home:en")
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local so we can run this outside of Next.js
config({ path: resolve(process.cwd(), ".env.local") });

import { Redis } from "@upstash/redis";
import type { PageVideo } from "../lib/videos";

const redis = Redis.fromEnv();

const seeds: Record<string, PageVideo> = {
  "video:home:en": {
    provider: "external",
    url: "https://example.com/home-en.mp4",
    title: "Home Intro Video",
    poster: "https://example.com/home-en-poster.jpg",
    enabled: true,
  },
  "video:home:zh": {
    provider: "external",
    url: "https://example.com/home-zh.mp4",
    title: "首页介绍视频",
    poster: "https://example.com/home-zh-poster.jpg",
    enabled: true,
  },
  "video:about:en": {
    provider: "external",
    url: "https://example.com/about-en.mp4",
    title: "About Me Video",
    enabled: false, // disabled — won't render on the about page
  },
  "video:about:zh": {
    provider: "external",
    url: "https://example.com/about-zh.mp4",
    title: "关于我的视频",
    enabled: false,
  },
  "video:projects:en": {
    provider: "external",
    url: "https://example.com/projects-en.mp4",
    title: "Projects Overview",
    enabled: false,
  },
  "video:projects:zh": {
    provider: "external",
    url: "https://example.com/projects-zh.mp4",
    title: "项目总览",
    enabled: false,
  },
};

async function seed() {
  console.log("Seeding video configs into Redis…\n");

  for (const [key, value] of Object.entries(seeds)) {
    await redis.set(key, JSON.stringify(value));
    console.log(`  ✓ set  ${key}  (enabled: ${value.enabled})`);
  }

  console.log("\nDone. To verify, run:");
  console.log('  npx tsx -e "import {Redis} from \'@upstash/redis\'; const r = Redis.fromEnv(); r.get(\'video:home:en\').then(console.log)"');
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
