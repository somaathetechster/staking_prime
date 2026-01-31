import { db } from "../lib/db";
import { sendOTP } from "../lib/email"; // Your email helper

export default async function handler(req, res) {
  const { email, password, mode } = req.body;

  // 1. Find the user
  const user = await db.user.findUnique({ where: { email } });

  if (mode === "login") {
    // GATEKEEPING: Check if user exists and is approved
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    if (user.status !== "APPROVED") {
      return res.status(403).json({ 
        message: "Access Denied: Your account is currently under review by our vetting team." 
      });
    }
  } else if (mode === "request") {
    // REGISTRATION: Create a pending user if they don't exist
    if (user) return res.status(400).json({ message: "Account already exists. Please sign in." });
    
    await db.user.create({
      data: { email, password, status: "PENDING_REVIEW" }
    });
  }

  // 2. If we reach here, generate and send OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await db.otpStore.upsert({ /* save OTP logic */ });
  await sendOTP(email, otp);

  return res.status(200).json({ success: true });
}