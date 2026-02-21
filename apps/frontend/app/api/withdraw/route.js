import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { amount, currency, destinationAddress } = await request.json();
    const userId = session.user.id;

    // 1. ATOMIC VALIDATION & LOCK
    const result = await db.$transaction(async (tx) => {
      // Check available balance
      const balance = await tx.balance.findUnique({
        where: { userId_currency: { userId, currency } }
      });

      if (!balance || balance.amount < parseFloat(amount)) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      // 2. DEDUCT AND FREEZE
      // We remove the funds from 'available' and create a PENDING ledger entry
      await tx.balance.update({
        where: { userId_currency: { userId, currency } },
        data: { amount: { decrement: parseFloat(amount) } }
      });

      return await tx.ledger.create({
        data: {
          userId,
          type: 'WITHDRAWAL',
          amount: -parseFloat(amount), // Negative movement
          currency,
          status: 'PENDING',
          txId: `WITHDRAW_${Date.now()}`,
          metadata: { destinationAddress, platform: 'EXTERNAL_WALLET' }
        }
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}