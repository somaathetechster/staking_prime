import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";

export async function POST(request, { params }) {
  const { id } = params;
  const { amount, currency, reason } = await request.json();

  try {
    await db.$transaction(async (tx) => {
      // 1. Update the User's Balance Table
      await tx.balance.upsert({
        where: { userId_currency: { userId: id, currency } },
        update: { amount: { increment: parseFloat(amount) } },
        create: { userId: id, currency, amount: parseFloat(amount) }
      });

      // 2. Create an Audit Trail in the Ledger
      await tx.ledger.create({
        data: {
          userId: id,
          type: 'MANUAL_ADJUSTMENT',
          amount: parseFloat(amount),
          currency,
          status: 'COMPLETED',
          metadata: { 
            admin_note: reason,
            source: 'OFFLINE_PAYMENT'
          }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "ADJUSTMENT_FAILED" }, { status: 500 });
  }
}