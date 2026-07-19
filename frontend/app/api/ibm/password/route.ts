import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

// Valid usernames — keeps the API from being used for arbitrary keys
const VALID_NAMES = new Set([
  "Bushra", "Eknoor", "Kamran", "Kunal", "Anmol",
  "Christophe", "Ricky", "Jay", "Daniel", "Patrick", "Alvin", "Wener", "Fermi",
]);

function redisKey(name: string) {
  return `ibm_pw:${name}`;
}

// GET /api/ibm/password?name=Bushra
// Returns { customPassword: string | null }
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? "";

  if (!VALID_NAMES.has(name)) {
    return NextResponse.json({ customPassword: null }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  let pw: string | null = null;
  try {
    pw = await getRedis().get<string>(redisKey(name));
  } catch {
    // Redis unavailable — return null gracefully
  }
  return NextResponse.json({ customPassword: pw ?? null }, {
    headers: { "Cache-Control": "no-store" },
  });
}

// POST /api/ibm/password
// Body: { name, password }          → sets custom password
// Body: { name, password: null }    → clears custom password
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { name, password } = body as { name?: string; password?: string | null };

  if (!name || !VALID_NAMES.has(name)) {
    return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });
  }

  if (password === null || password === undefined || password === "") {
    // Clear custom password
    try {
      await getRedis().del(redisKey(name));
    } catch {
      return NextResponse.json({ ok: false, error: "Redis unavailable" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, action: "cleared" });
  }

  if (typeof password !== "string" || password.length < 4) {
    return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });
  }

  try {
    await getRedis().set(redisKey(name), password);
  } catch {
    return NextResponse.json({ ok: false, error: "Redis unavailable" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, action: "saved" });
}
