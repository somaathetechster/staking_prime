import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * SESSION TERMINATION
 * Endpoint: POST /api/auth/logout
 */
export async function POST() {
  // 1. RESOLVE COOKIE STORE (Next.js 15/16 Async Fix)
  const cookieStore = await cookies();

  // 2. DESTROY COOKIE
  // Setting expires to Epoch (1970) ensures the browser nukes it immediately.
  cookieStore.set("admin_session_token", "", {
    httpOnly: true,
    expires: new Date(0), 
    path: "/",
  });

  console.log("[ADMIN_SESSION] Logout successful. Terminal session closed.");

  return NextResponse.json({
    status: "TERMINATED",
    message: "Secure session ended."
  });
}