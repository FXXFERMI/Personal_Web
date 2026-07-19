import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// ─── IBM session verification (Edge-compatible — Web Crypto API) ───────────────

const COOKIE_NAME = "ibm_session";

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

async function verifyToken(token: string): Promise<string | null> {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const secret = process.env.IBM_SESSION_SECRET ?? "ibm-fallback-dev-secret-change-in-prod";
  const key = await getCryptoKey(secret);

  // Re-derive expected signature and verify
  const payloadBytes = new TextEncoder().encode(payload);

  // The token sig is base64url-encoded — decode it for comparison
  function base64urlToUint8Array(b64: string): Uint8Array {
    const std = b64.replace(/-/g, "+").replace(/_/g, "/").padEnd(
      b64.length + ((4 - (b64.length % 4)) % 4), "="
    );
    const bin = atob(std);
    return new Uint8Array(bin.split("").map((c) => c.charCodeAt(0)));
  }

  let sigBytes: Uint8Array;
  try {
    sigBytes = base64urlToUint8Array(sig);
  } catch {
    return null;
  }

  if (!await crypto.subtle.verify("HMAC", key, sigBytes as BufferSource, payloadBytes)) return null;

  // Decode payload and check expiry + extract name
  try {
    const json = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(
          atob(payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(
            payload.length + ((4 - (payload.length % 4)) % 4), "="
          )).split(""),
          (c) => c.charCodeAt(0)
        )
      )
    ) as { name?: string; exp?: number };
    if (json.exp && Date.now() > json.exp) return null;
    return typeof json.name === "string" ? json.name : null;
  } catch {
    return null;
  }
}

// ─── Intl middleware factory ───────────────────────────────────────────────────

const intlMiddleware = createIntlMiddleware(routing);

// ─── Combined middleware ────────────────────────────────────────────────────────

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /IBM/[name] — any path under /IBM/ except /IBM itself
  const ibmMatch = pathname.match(/^\/IBM\/([^/]+)/);
  if (ibmMatch) {
    const urlName = decodeURIComponent(ibmMatch[1]);
    const token = req.cookies.get(COOKIE_NAME)?.value ?? "";
    const authedName = token ? await verifyToken(token) : null;

    // Cookie must exist AND the name in the token must match the URL segment
    if (!authedName || authedName.toLowerCase() !== urlName.toLowerCase()) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/IBM";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
    // Authenticated and name matches — serve the page
    return NextResponse.next();
  }

  // All other routes: run the i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // IBM protected sub-pages — /IBM/[name], but NOT /IBM itself
    "/IBM/:name+",
    // Internationalized routes — explicitly excludes /IBM and /api
    "/",
    "/(en|zh)/:path*",
    "/((?!_next|_vercel|IBM|api|.*\\..*).*)",
  ],
};

// Made with Bob
