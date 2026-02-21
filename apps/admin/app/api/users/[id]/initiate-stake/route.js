import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";

export async function POST(request, { params }) {
  const { id } = params;
  const { planId, amount } = await request.json();

  // PLAN DEFINITION MAP
  const PLANS = {
    PRIME_30: { name: "PRIME_30", apy: 156, durationDays: 30, label: "Prime 30 (Monthly)" },
    PRIME_150: { name: "PRIME_150", apy: 150, durationDays: 365, label: "Prime 150 (Annual)" },
    PRIME_3200: { name: "PRIME_3200", apy: 320, durationDays: 3650, label: "Prime 3200 (Decade)" },
  };

  const selectedPlan = PLANS[planId];
  if (!selectedPlan) return NextResponse.json({ error: "INVALID_PLAN" }, { status: 400 });

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Check if user has enough balance
      const balance = await tx.balance.findUnique({
        where: { userId_currency: { userId: id, currency: 'USD' } }
      });

      if (!balance || balance.amount < amount) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      // 2. Deduct from Available Balance
      await tx.balance.update({
        where: { userId_currency: { userId: id, currency: 'USD' } },
        data: { amount: { decrement: parseFloat(amount) } }
      });

      // 3. Create the Stake Record
      const nextPayout = new Date();
      nextPayout.setDate(nextPayout.getDate() + 1); // First payout in 24h

      const stake = await tx.stake.create({
        data: {
          userId: id,
          planId: selectedPlan.name,
          amount: parseFloat(amount),
          apy: selectedPlan.apy,
          status: 'ACTIVE',
          nextPayout: nextPayout,
          metadata: { 
            initiatedBy: 'ADMIN_MANUAL',
            planLabel: selectedPlan.label 
          }
        }
      });

      // 4. Record the Movement in Ledger
      await tx.ledger.create({
        data: {
          userId: id,
          type: 'STAKE_DELEGATION',
          amount: -parseFloat(amount),
          currency: 'USD',
          status: 'COMPLETED',
          txId: `STK_INIT_${Date.now()}`,
          metadata: { plan: selectedPlan.name }
        }
      });

      return stake;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("STAKE_INIT_FAILURE:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}