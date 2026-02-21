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
    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
      console.warn(`[AUTH_DENIED] Failed handshake for: ${cleanEmail}`);
      return NextResponse.json(
        { success: false, message: "CRYPTOGRAPHIC_MISMATCH: INVALID_TOKEN" }, 
        { status: 401 }
      );
    }

    // 3. ATOMIC CLEANUP
    // Neutralize the OTP immediately after successful use
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

    // 5. DEPLOY SECURE COOKIES (Fixed for Middleware Compatibility)
    const cookieStore = await cookies();
    
    // A. The Auth Token (Spoofing the NextAuth name so your middleware works seamlessly)
    cookieStore.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed to lax to prevent issues with redirects
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    // B. The Status Token (Crucial for the /pending vetting logic)
    cookieStore.set("user_status", user.status, {
      httpOnly: false, // False so the frontend UI can read it if needed
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    console.log(`[UPLINK_ESTABLISHED] ${user.email} | Status: ${user.status}`);

    // 6. FINAL HANDSHAKE
    return NextResponse.json({ 
      success: true, 
      status: user.status 
    });

  } catch (error) {
    console.error("[VERIFY_GATEWAY_FAULT]:", error);
    return NextResponse.json({ success: false, message: "INTERNAL_FAULT" }, { status: 500 });
  }
}