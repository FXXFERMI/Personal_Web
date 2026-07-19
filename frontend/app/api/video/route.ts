import { type NextRequest, NextResponse } from "next/server";
import { getPageVideo } from "@/lib/videos";

/**
 * GET /api/video?page=home&locale=en
 *
 * Returns the PageVideo config for the requested page + locale, or null when
 * no video is configured / enabled.
 *
 * This route exists so that "use client" pages (which cannot call Redis
 * directly) can still fetch video configuration at runtime.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = searchParams.get("page");
  const locale = searchParams.get("locale") as "en" | "zh" | null;

  if (!page || !locale || !["en", "zh"].includes(locale)) {
    return NextResponse.json(
      { error: "Missing or invalid query params: page, locale" },
      { status: 400 }
    );
  }

  const video = await getPageVideo(page, locale);

  // Always return 200 — null means "no video for this page/locale"
  return NextResponse.json({ video });
}
