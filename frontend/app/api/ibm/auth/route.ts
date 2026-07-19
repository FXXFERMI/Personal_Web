import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { createHmac, timingSafeEqual } from "crypto";

// Default passwords assigned at launch — stored only on the server.
const DEFAULT_PASSWORDS: Record<string, string> = {
  Bushra: "126579",
  Eknoor: "741852",
  Kamran: "452931",
  Kunal: "275918",
  Anmol: "563047",
  Christophe: "481736",
  Ricky: "907268",
  Jay: "617395",
  Daniel: "398624",
  Patrick: "685413",
  Alvin: "834261",
  Wener: "952184",
  Fermi: "123456",
};

const VALID_NAMES = new Set(Object.keys(DEFAULT_PASSWORDS));
export const COOKIE_NAME = "ibm_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.IBM_SESSION_SECRET ?? "ibm-fallback-dev-secret-change-in-prod";
}

function redisKey(name: string) {
  return `ibm_pw:${name}`;
}

/** Encode a token as  base64(payload).base64(hmac)  */
export function signToken(name: string): string {
  const payload = Buffer.from(
    JSON.stringify({ name, exp: Date.now() + COOKIE_MAX_AGE * 1000 })
  ).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Returns the authenticated name, or null if the token is invalid/expired */
export function verifyToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  } catch {
    return null;
  }

  try {
    const { name, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      name: string;
      exp: number;
    };
    if (Date.now() > exp) return null;
    if (!VALID_NAMES.has(name)) return null;
    return name;
  } catch {
    return null;
  }
}

// POST /api/ibm/auth  — { username, password } → sets HttpOnly session cookie
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
  }

  // Case-insensitive username lookup
  const match = Array.from(VALID_NAMES).find(
    (k) => k.toLowerCase() === username.trim().toLowerCase()
  );

  if (!match) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  // 1. Check default password
  let authenticated = password === DEFAULT_PASSWORDS[match];

  // 2. If not, check custom password from Redis
  if (!authenticated) {
    try {
      const custom = await getRedis().get<string>(redisKey(match));
      if (custom && password === custom) authenticated = true;
    } catch {
      // Redis error — only default password works as fallback
    }
  }

  if (!authenticated) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  const token = signToken(match);
  const res = NextResponse.json({ ok: true, name: match });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
