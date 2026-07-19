import { NextResponse } from "next/server";

const COOKIE_NAME = "ibm_session";

// POST /api/ibm/logout — clears the session cookie
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
