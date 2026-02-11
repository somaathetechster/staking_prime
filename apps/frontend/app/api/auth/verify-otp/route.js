import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

/**
 * VERIFICATION GATEWAY
 * Final handshake for Terminal Login and Vetting Requests
 */
export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    const cleanEmail = email.toLowerCase();

    // 1. RESOLVE IDENTITY
    const user = await db.user.findUnique({
      where: { email: cleanEmail }
    });

    // 2. CRYPTOGRAPHIC VALIDATION
    // Check: Does user exist? Does OTP match? Is it still within 10-min window?
    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
      console.warn(`[AUTH_DENIED] Failed handshake for: ${cleanEmail}`);
      return NextResponse.json(
        { success: false, message: "CRYPTOGRAPHIC_MISMATCH: INVALID_TOKEN" }, 
        { status: 401 }
      );
    }

    // 3. ATOMIC CLEANUP
    // Neutralize the OTP immediately after successful use (Single-use security)
    await db.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpires: null }
    });

    // 4. GENERATE SESSION TOKEN
    const token = await new SignJWT({ 
        sub: user.id, 
        role: user.role, 
        email: user.email 
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") 
      .sign(JWT_SECRET);

    // 5. DEPLOY SECURE COOKIE
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    console.log(`[UPLINK_ESTABLISHED] ${user.email} | Status: ${user.status}`);

    // 6. FINAL HANDSHAKE
    return NextResponse.json({ 
      success: true, 
      status: user.status // PENDING_REVIEW or APPROVED
    });

  } catch (error) {
    console.error("[VERIFY_GATEWAY_FAULT]:", error);
    return NextResponse.json({ success: false, message: "INTERNAL_FAULT" }, { status: 500 });
  }
}