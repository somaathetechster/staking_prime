import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; 
import { z } from "zod";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

/**
 * INSTITUTIONAL ACCESS PROTOCOL
 * Endpoint: POST /api/auth/admin-login
 */
export async function POST(request) {
  try {
    // 1. SURGICAL INPUT VALIDATION
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const body = await request.json();
    const { email, password } = schema.parse(body);

    // 2. IDENTITY RESOLUTION
    const user = await db.user.findUnique({
      where: { email },
    });

    // 3. SECURITY: GENERIC FAILURE (Anti-Enumeration)
    if (!user) {
      return NextResponse.json(
        { code: "AUTH_FAILURE", message: "Credentials rejected by gateway." },
        { status: 401 }
      );
    }

    // 4. AUTHORITY CHECK
    if (user.role !== "ADMIN") {
      console.warn(`[SECURITY_ALERT] Unauthorized access attempt by ${email}`);
      return NextResponse.json(
        { code: "ACCESS_DENIED", message: "Clearance Level Insufficient." },
        { status: 403 }
      );
    }

    // 5. CRYPTOGRAPHIC VERIFICATION
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { code: "AUTH_FAILURE", message: "Credentials rejected by gateway." },
        { status: 401 }
      );
    }

    // 6. SESSION TOKEN GENERATION
    const token = await new SignJWT({ 
        sub: user.id, 
        role: user.role, 
        email: user.email 
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // 7. SET SECURE COOKIE (NEXT.JS 15/16 FIX)
    // We must await the cookies() function before calling .set()
    const cookieStore = await cookies(); 
    
    cookieStore.set("admin_session_token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      path: "/", 
      maxAge: 60 * 60 * 24, 
    });

    // 8. LOG SUCCESS
    console.log(`[ADMIN_ACCESS] Session initialized for ${email}`);

    return NextResponse.json({
      status: "SUCCESS",
      message: "UPLINK_ESTABLISHED",
      redirect: "/"
    });

  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "Gateway handshake failed." },
      { status: 500 }
    );
  }
}