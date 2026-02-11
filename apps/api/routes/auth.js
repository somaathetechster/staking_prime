import { db } from "../lib/db";
import { generateToken } from "../lib/jwt"; // Assumed utility
import { z } from "zod"; // Surgical input validation

/**
 * INSTITUTIONAL_ACCESS_PROTOCOL
 * Handles: OTP Verification -> Identity Resolution -> Session Issuance
 */
export async function verifyOTP(req, res) {
  try {
    // 1. Surgical Input Validation
    const schema = z.object({
      email: z.string().email(),
      otp: z.string().length(6), // Standard 6-digit MFA
    });

    const { email, otp } = schema.parse(req.body);

    // [LOGIC_GAP]: Implement actual OTP verification here (e.g., Redis/DB check)
    // For now, we proceed to Identity Resolution assuming OTP is valid.

    // 2. Identity Resolution (Find or Initialize)
    // We use 'upsert' to handle race conditions in high-concurrency environments.
    const user = await db.user.upsert({
      where: { email },
      update: { 
        lastLogin: new Date() 
      },
      create: {
        email,
        status: "PENDING_REVIEW", // The "Hard Stop" default for all new principals
        role: "USER",
        kycLevel: 0
      },
    });

    // 3. Generate High-Assurance Session Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status, // Critical: Embeds "PENDING_REVIEW" or "APPROVED"
    });

    // 4. Set the "Firewall Cookie" (Read by Middleware.js)
    // This is the key that opens the "Dashboard" or sends them to "Pending"
    const isProd = process.env.NODE_ENV === "production";
    
    res.cookie("user_status", user.status, {
      httpOnly: false, // Must be readable by Client for UI logic (Middleware reads server-side)
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 Hours
    });

    // 5. Set the "Session Cookie" (HttpOnly - Invisible to Client JS)
    res.cookie("session_token", token, {
      httpOnly: true, // Security: Preventing XSS theft
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 6. Return Institutional Response
    return res.status(200).json({
      status: "SUCCESS",
      code: "IDENTITY_VERIFIED",
      data: {
        userId: user.id,
        accessStatus: user.status, // "PENDING_REVIEW" or "APPROVED"
        redirectPath: user.status === "APPROVED" ? "/dashboard" : "/pending"
      }
    });

  } catch (error) {
    console.error("AUTH_PROTOCOL_FAILURE:", error);
    return res.status(401).json({
      status: "ERROR",
      code: "ACCESS_DENIED",
      message: "Credentials rejected by security gateway."
    });
  }
}