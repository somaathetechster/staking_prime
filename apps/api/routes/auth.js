import { getEffectiveRate } from "@primestakecorp/finance";

export async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  // 1. Verify OTP logic here...
  
  // 2. Fetch or Create User
  let user = await db.user.findUnique({ where: { email } });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        // The core decision: Every new user starts here
        status: 'pending_review', 
      }
    });
  }

  // 3. Generate JWT with the status included
  const token = generateToken({ 
    id: user.id, 
    status: user.status 
  });

  // 4. Set the cookie that the Frontend Middleware reads
  res.cookie('user_status', user.status, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production' 
  });

  return res.json({ 
    success: true, 
    status: user.status, 
    token 
  });
}