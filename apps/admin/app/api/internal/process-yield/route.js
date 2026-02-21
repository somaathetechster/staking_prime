import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";

/**
 * DAILY_YIELD_PROTOCOL (Vercel Cron Compatible)
 * Frequency: 0 0 * * * (Daily at Midnight)
 */
export async function GET(request) {
  try {
    // 1. SECURITY HANDSHAKE
    // Vercel sends a CRON_SECRET or an Authorization header to verify the caller
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ code: 'UNAUTHORIZED_PROTOCOL' }, { status: 401 });
    }

    console.log('[YIELD_ENGINE] Initiating daily distribution sequence...');

    // 2. FETCH ELIGIBLE POSITIONS
    const activeStakes = await db.stake.findMany({
      where: {
        status: 'ACTIVE',
        nextPayout: { lte: new Date() }
      },
      include: { user: true }
    });

    if (activeStakes.length === 0) {
      return NextResponse.json({ status: 'IDLE', message: 'No eligible stakes.' });
    }

    // 3. ATOMIC DISTRIBUTION BATCH
    const results = await db.$transaction(async (tx) => {
      let count = 0;

      for (const stake of activeStakes) {
        // Mathematical Precision
        const dailyYield = (parseFloat(stake.amount) * (stake.apy / 100)) / 365;
        if (dailyYield < 0.01) continue; // Skip microscopic dust

        const payoutId = `PAY_STK_${stake.id}_${new Date().toISOString().split('T')[0]}`;

        // A. Ledger Entry
        await tx.ledger.create({
          data: {
            userId: stake.userId,
            type: 'YIELD_PAYOUT',
            amount: dailyYield,
            currency: 'USD',
            status: 'COMPLETED',
            txId: payoutId,
            metadata: { stakeId: stake.id, apy: stake.apy }
          }
        });

        // B. Balance Credit
        await tx.balance.upsert({
          where: { userId_currency: { userId: stake.userId, currency: 'USD' } },
          update: { amount: { increment: dailyYield } },
          create: { userId: stake.userId, currency: 'USD', amount: dailyYield }
        });

        // C. Update Schedule
        const nextDate = new Date(stake.nextPayout);
        nextDate.setDate(nextDate.getDate() + 1);

        await tx.stake.update({
          where: { id: stake.id },
          data: {
            nextPayout: nextDate,
            totalEarnings: { increment: dailyYield }
          }
        });

        count++;
      }
      return count;
    }, { timeout: 30000 }); // High timeout for large batches

    return NextResponse.json({
      status: 'SUCCESS',
      processed: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[YIELD_FAILURE]', error);
    return NextResponse.json({ code: 'PROTOCOL_FAILURE', details: error.message }, { status: 500 });
  }
}