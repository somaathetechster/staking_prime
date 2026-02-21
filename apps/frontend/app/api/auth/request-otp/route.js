import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// FIXED: Correctly importing 'sendOTP' to match your email.service.js
import { sendOTP } from "../../../../services/email.service"; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, mode } = body;

    console.log(`[AUTH_DEBUG] Incoming Request -> Email: ${email} | Mode: ${mode}`);

    if (!email || !password) {
      return NextResponse.json({ message: "MISSING_FIELDS: Email and Password required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase();
    
    // GENERATE CHALLENGE
    const tempOTP = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); 

    // --- BRANCH A: NEW APPLICATION ---
    if (mode === "request" || mode === "signup") { 
      const existing = await db.user.findUnique({ where: { email: cleanEmail } });
      
      if (existing) {
        return NextResponse.json(
          { message: "IDENTITY_EXISTS: Please use login protocol." }, 
          { status: 409 } 
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await db.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          otp: tempOTP,
          otpExpires: expiry,
          status: "PENDING_REVIEW", 
          role: "USER",
          kycLevel: 0
        }
      });
      
      console.log(`[VETTING_INITIATED] New applicant created: ${cleanEmail}`);

    } 
    // --- BRANCH B: EXISTING USER LOGIN ---
    else {
      const user = await db.user.findUnique({ where: { email: cleanEmail } });
      
      if (!user) {
        console.warn(`[AUTH_FAIL] User not found: ${cleanEmail}`);
        return NextResponse.json({ message: "CREDENTIAL_REJECTION" }, { status: 401 });
      }

      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        console.warn(`[AUTH_FAIL] Invalid password for: ${cleanEmail}`);
        return NextResponse.json({ message: "CREDENTIAL_REJECTION" }, { status: 401 });
      }

      await db.user.update({
        where: { email: cleanEmail },
        data: { otp: tempOTP, otpExpires: expiry }
      });
    }

    // 2. DISPATCH NOTIFICATION VIA SERVICE
    console.log(`\n--- [UPLINK_CHALLENGE] ---\nTARGET: ${cleanEmail}\nCODE:   ${tempOTP}\n--------------------------\n`);

    // FIXED: Calling the correctly named function
    const emailResult = await sendOTP(cleanEmail, tempOTP);
    
    if (!emailResult.success) {
      console.error("[GATEWAY_WARNING] DB updated, but email dispatch failed. Check Resend configuration.");
    }

    return NextResponse.json({ 
      status: "CHALLENGE_DISPATCHED",
      message: "Security code sent." 
    });

  } catch (error) {
    console.error("[GATEWAY_ERROR]", error);
    return NextResponse.json({ message: "SYSTEM_FAILURE" }, { status: 500 });
  }
}