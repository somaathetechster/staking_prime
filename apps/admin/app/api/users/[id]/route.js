import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import { auditWalletBalance } from "../../../services/wallet.service";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        wallets: true,
        balances: true,
        stakes: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    // Sync Tatum Live Balances for the Admin view
    const syncedBalances = await Promise.all(user.wallets.map(async (w) => {
      const live = await auditWalletBalance(w.tatumAccountId);
      return {
        currency: w.currency,
        onChain: live?.available || 0,
        localLedger: user.balances.find(b => b.currency === w.currency)?.amount || 0
      };
    }));

    return NextResponse.json({
      user,
      financials: {
        wallets: syncedBalances,
        activeStakes: user.stakes
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}