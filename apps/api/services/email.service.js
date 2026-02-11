// apps/api/services/email.service.js
import { Resend } from 'resend';

// Get this from https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (email, otp) => {
  try {
    const data = await resend.emails.send({
      from: 'Security <onboarding@primestakecorp.com>', // Use 'onboarding@resend.dev' for testing if you don't have a domain yet
      to: [email],
      subject: `[SECURE_LOGIN] Verification Code: ${otp}`,
      html: `
        <div style="font-family: monospace; background: #050505; color: #e5e5e5; padding: 40px; border: 1px solid #333;">
          <h1 style="color: #D4AF37; letter-spacing: 2px; font-size: 18px; margin-bottom: 24px;">INSTITUTIONAL ACCESS</h1>
          <p style="font-size: 12px; color: #888; text-transform: uppercase;">Verification Protocol Initiated</p>
          
          <div style="background: #000; border: 1px solid #333; padding: 24px; font-size: 32px; letter-spacing: 8px; color: #fff; display: inline-block; margin: 16px 0; font-weight: bold;">
            ${otp}
          </div>
          
          <p style="color: #555; font-size: 10px; margin-top: 24px; text-transform: uppercase; border-top: 1px solid #222; padding-top: 12px;">
            Security Warning: This code expires in 10 minutes.<br/>
            If you did not request this access, terminate session immediately.
          </p>
        </div>
      `,
    });

    console.log(`[EMAIL_DISPATCH] OTP Sent via Resend ID: ${data.id}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('[RESEND_FAILURE]', error);
    // In dev mode, we might want to log the OTP to console so you can still login
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV_FALLBACK] OTP for ${email}: ${otp}`);
      return { success: true }; 
    }
    throw new Error('EMAIL_GATEWAY_FAILURE');
  }
};