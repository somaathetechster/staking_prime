import { NextResponse } from 'next/server';
import { db } from '../../lib/db';
import { auditWalletBalance } from '../../services/wallet.service';
import { getServerSession } from "next-auth"; // Or your custom session logic

export async function GET() {
  const session = await getServerSession(); // Secure the route
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // 1. Get user's wallet IDs from DB
  const wallets = await db.wallet.findMany({ where: { userId } });

  // 2. Audit them against Tatum in parallel
  const balanceAudit = await Promise.all(wallets.map(async (w) => {
    const live = await auditWalletBalance(w.tatumAccountId);
    
    // 3. (Optional) Sync DB if live balance differs significantly
    if (live) {
      await db.balance.update({
        where: { userId_currency: { userId, currency: w.currency } },
        data: { amount: live.available }
      });
    }
    
    return { currency: w.currency, balance: live?.available || 0 };
  }));

  return NextResponse.json({ success: true, balances: balanceAudit });
}