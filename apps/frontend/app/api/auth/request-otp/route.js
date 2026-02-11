import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import { Resend } from 'resend';
import bcrypt from "bcryptjs";
import crypto from "crypto";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    // 1. SAFE PARSING
    const body = await request.json();
    const { email, password, mode } = body;

    console.log(`[AUTH_DEBUG] Incoming Request -> Email: ${email} | Mode: ${mode}`);

    if (!email || !password) {
      return NextResponse.json({ message: "MISSING_FIELDS: Email and Password required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase();
    
    // 2. GENERATE CHALLENGE
    const tempOTP = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); 

    // --- BRANCH A: NEW APPLICATION ---
    if (mode === "request" || mode === "signup") { // Handle both common flags
      
      const existing = await db.user.findUnique({ where: { email: cleanEmail } });
      
      if (existing) {
        return NextResponse.json(
          { message: "IDENTITY_EXISTS: Please use login protocol." }, 
          { status: 409 } // 409 Conflict is better for "Already exists"
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await db.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          otp: tempOTP,
          otpExpires: expiry,
          status: "PENDING_REVIEW", // <--- Triggers Admin Vetting
          role: "USER",
          kycLevel: 0
        }
      });
      
      console.log(`[VETTING_INITIATED] New applicant created: ${cleanEmail}`);

    } 
    // --- BRANCH B: EXISTING USER LOGIN ---
    else {
      const user = await db.user.findUnique({ where: { email: cleanEmail } });
      
      // DIAGNOSTIC 401: This is likely where your error was coming from
      if (!user) {
        console.warn(`[AUTH_FAIL] User not found: ${cleanEmail}`);
        return NextResponse.json({ message: "CREDENTIAL_REJECTION" }, { status: 401 });
      }

      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        console.warn(`[AUTH_FAIL] Invalid password for: ${cleanEmail}`);
        return NextResponse.json({ message: "CREDENTIAL_REJECTION" }, { status: 401 });
      }

      // Update OTP
      await db.user.update({
        where: { email: cleanEmail },
        data: { otp: tempOTP, otpExpires: expiry }
      });
    }

    // 3. DISPATCH NOTIFICATION
    if (resend) {
      await resend.emails.send({
        from: 'Primestake Security <auth@primestakecorp.com>',
        to: cleanEmail,
        subject: `SECURE LOGIN: ${tempOTP}`,
        html: `
          <body style="background: #000; color: #fff; font-family: monospace; padding: 20px;">
            <div style="border: 1px solid #333; padding: 40px; max-width: 400px; margin: 0 auto;">
              <h1 style="font-size: 14px; letter-spacing: 2px; color: #888; margin-bottom: 20px;">
                IDENTITY_VERIFICATION
              </h1>
              <div style="font-size: 32px; letter-spacing: 10px; color: #D4AF37; margin-bottom: 30px; font-weight: bold;">
                ${tempOTP}
              </div>
            </div>
          </body>
        `
      });
    }

    // DEV LOG (For testing without email)
    console.log(`\n--- [UPLINK_CHALLENGE] ---\nTARGET: ${cleanEmail}\nCODE:   ${tempOTP}\n--------------------------\n`);

    return NextResponse.json({ 
      status: "CHALLENGE_DISPATCHED",
      message: "Security code sent." 
    });

  } catch (error) {
    console.error("[GATEWAY_ERROR]", error);
    return NextResponse.json({ message: "SYSTEM_FAILURE" }, { status: 500 });
  }
}