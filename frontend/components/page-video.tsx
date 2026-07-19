"use client";

import type { PageVideo } from "@/lib/videos";

// ---------------------------------------------------------------------------
// TODO (Mux): When you're ready to add Mux support, install @mux/mux-player-react
// and replace the <video> element below with <MuxPlayer> for the "mux" provider.
//   npm install @mux/mux-player-react
//   import MuxPlayer from "@mux/mux-player-react";
//
// TODO (Cloudflare Stream): For Cloudflare Stream, use an <iframe> with the
// stream URL or install @cloudflare/stream-react.
// ---------------------------------------------------------------------------

interface PageVideoProps {
  video: PageVideo;
  className?: string;
}

export default function PageVideoComponent({ video, className = "" }: PageVideoProps) {
  // ------------------------------------------------------------------
  // Mux — placeholder until @mux/mux-player-react is installed
  // ------------------------------------------------------------------
  if (video.provider === "mux") {
    if (!video.playbackId) return null;
    // TODO: Replace with <MuxPlayer playbackId={video.playbackId} ... />
    return (
      <div
        className={`rounded-xl overflow-hidden bg-black w-full ${className}`}
        aria-label={video.title}
      >
        {/* Mux HLS fallback using native <video> */}
        <video
          className="w-full"
          controls
          preload="metadata"
          playsInline
          poster={video.poster}
          aria-label={video.title}
        >
          <source
            src={`https://stream.mux.com/${video.playbackId}.m3u8`}
            type="application/x-mpegURL"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Cloudflare Stream — placeholder
  // ------------------------------------------------------------------
  if (video.provider === "cloudflare") {
    if (!video.playbackId) return null;
    // TODO: Replace with @cloudflare/stream-react <Stream> component
    return (
      <div
        className={`rounded-xl overflow-hidden bg-black w-full ${className}`}
        aria-label={video.title}
      >
        <iframe
          src={`https://customer-${video.playbackId}.cloudflarestream.com/iframe`}
          className="w-full aspect-video"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      </div>
    );
  }

  // ------------------------------------------------------------------
  // External URL — standard HTML5 <video>
  // ------------------------------------------------------------------
  if (!video.url) return null;

  return (
    <div
      className={`rounded-xl overflow-hidden bg-black w-full ${className}`}
    >
      <video
        className="w-full"
        controls
        preload="metadata"
        playsInline
        poster={video.poster}
        aria-label={video.title}
      >
        <source src={video.url} />
        Your browser does not support the video tag.
      </video>
      {video.title && (
        <p className="px-3 py-2 text-sm text-white/60 bg-black/80">
          {video.title}
        </p>
      )}
    </div>
  );
}
