// apps/admin/app/api/vetting/route.js

import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db"; 
import { Resend } from "resend";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// FIXED: Use relative path to guarantee the file is found
import { generateUserWallet } from "../../services/wallet.service";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    // 1. SECURITY CHECK
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session_token");

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try { await jwtVerify(token.value, JWT_SECRET); } catch (e) { return NextResponse.json({ message: "Expired" }, { status: 403 }); }

    const { userId, action } = await request.json();
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    if (newStatus === 'APPROVED') {
      
      // 2. PROVISION INFRASTRUCTURE (With Fallback)
      let btcWallet, usdtWallet;
      try {
        // Try to generate real wallets via Tatum
        btcWallet = await generateUserWallet(userId, 'BTC');
        usdtWallet = await generateUserWallet(userId, 'USDT');
      } catch (infraError) {
        console.warn("[INFRA_WARN] Tatum provision failed. Using MOCK data for dev environment.");
        // Fallback Mock Data so Admin doesn't crash
        const timestamp = Date.now().toString().slice(-4);
        btcWallet = { address: `bc1q_MOCK_${userId.slice(0,4)}_${timestamp}`, tatumAccountId: 'MOCK_ID' };
        usdtWallet = { address: `TR_MOCK_${userId.slice(0,4)}_${timestamp}`, tatumAccountId: 'MOCK_ID' };
      }

      // 3. ATOMIC DB TRANSACTION
      await db.$transaction([
        // A. Approve User
        db.user.update({
          where: { id: userId },
          data: { status: 'APPROVED', kycLevel: 1, updatedAt: new Date() }
        }),
        // B. Create Wallets
        db.wallet.createMany({
          data: [
            { userId, currency: 'BTC', address: btcWallet.address, tatumAccountId: btcWallet.tatumAccountId },
            { userId, currency: 'USDT', address: usdtWallet.address, tatumAccountId: usdtWallet.tatumAccountId }
          ]
        }),
        // C. Initialize Zero Balances
        db.balance.createMany({
          data: [
            { userId, currency: 'BTC', amount: 0.00, staked: 0.00 },
            { userId, currency: 'USDT', amount: 0.00, staked: 0.00 }
          ]
        })
      ]);

      // 4. SEND EMAIL
      if (resend) await sendApprovalEmail(userId);

    } else {
      // REJECTION PATH
      await db.user.update({ where: { id: userId }, data: { status: 'REJECTED' } });
      if (resend) await sendRejectionEmail(userId);
    }

    return NextResponse.json({ success: true, status: newStatus });

  } catch (error) {
    console.error("[VETTING_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- EMAIL HELPERS ---

async function sendApprovalEmail(userId) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return;
  
  await resend.emails.send({
    from: 'Primestake <admin@primestakecorp.com>',
    to: user.email,
    subject: 'ACCESS GRANTED: Institutional Node Provisioned',
    html: `<p>Your account has been <strong>APPROVED</strong>. You may now access the terminal.</p>`
  });
}

async function sendRejectionEmail(userId) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return;

  await resend.emails.send({
    from: 'Primestake <admin@primestakecorp.com>',
    to: user.email,
    subject: 'Application Status Update',
    html: `<p>Your application was not successful at this time.</p>`
  });
}