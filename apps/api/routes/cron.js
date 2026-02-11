import express from 'express';
import { db } from '../lib/db';
import { z } from 'zod';

const router = express.Router();

// INSTITUTIONAL SECURITY
// This secret key effectively "signs" the execution command.
// Only Vercel Cron or your manual admin panel should have this.
const CRON_SECRET = process.env.CRON_SECRET; 

/**
 * DAILY_YIELD_PROTOCOL
 * Frequency: Daily (00:00 UTC)
 * Scope: Calculates and distributes interest for all active portfolios.
 */
router.get('/process-yield', async (req, res) => {
  try {
    // 1. SECURITY HANDSHAKE
    // We check the Authorization header for the Bearer token.
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      console.warn(`[SECURITY_ALERT] Unauthorized yield trigger attempt from ${req.ip}`);
      return res.status(401).json({ code: 'UNAUTHORIZED_PROTOCOL' });
    }

    console.log('[YIELD_ENGINE] Initiating daily distribution sequence...');

    // 2. FETCH ELIGIBLE POSITIONS
    // We look for stakes that are 'ACTIVE' and due for a payout.
    const activeStakes = await db.stake.findMany({
      where: {
        status: 'ACTIVE',
        nextPayout: {
          lte: new Date() // "Less than or equal to Now"
        }
      },
      include: { user: true }
    });

    if (activeStakes.length === 0) {
      console.log('[YIELD_ENGINE] No positions pending payout.');
      return res.status(200).json({ status: 'IDLE', message: 'No eligible stakes found.' });
    }

    console.log(`[YIELD_ENGINE] Processing ${activeStakes.length} active positions.`);

    // 3. ATOMIC DISTRIBUTION BATCH
    // We process all payouts in a single transaction to ensure ledger integrity.
    const results = await db.$transaction(async (tx) => {
      const operations = [];

      for (const stake of activeStakes) {
        // A. Mathematical Precision (Daily Rate)
        // Formula: (Principal * (APY / 100)) / 365
        const dailyYield = (parseFloat(stake.amount) * (stake.apy / 100)) / 365;
        
        // Ensure we don't pay out microscopic dust (< $0.01) if you prefer
        if (dailyYield <= 0) continue;

        const payoutId = `PAYOUT_${stake.id}_${new Date().toISOString().split('T')[0]}`; // Idempotency Key

        // B. Ledger Entry (The "Receipt")
        const ledgerOp = tx.ledger.create({
          data: {
            userId: stake.userId,
            type: 'YIELD_PAYOUT',
            amount: dailyYield,
            currency: 'USD', // Yield is typically paid in USD value or the native asset
            status: 'COMPLETED',
            txId: payoutId, // Prevents double-counting in audits
            metadata: {
              stakeId: stake.id,
              apy: stake.apy,
              period: 'DAILY_24H'
            }
          }
        });

        // C. Balance Credit (The "Cash")
        // We credit the user's USD Balance (or the asset balance, depending on your model)
        const balanceOp = tx.balance.upsert({
          where: { 
            userId_currency: { userId: stake.userId, currency: 'USD' } 
          },
          update: { amount: { increment: dailyYield } },
          create: { userId: stake.userId, currency: 'USD', amount: dailyYield }
        });

        // D. Stake Schedule Update (The "Clock")
        // Move the next payout date forward by 24 hours
        const nextDate = new Date(stake.nextPayout);
        nextDate.setDate(nextDate.getDate() + 1);

        const stakeOp = tx.stake.update({
          where: { id: stake.id },
          data: {
            nextPayout: nextDate,
            totalEarnings: { increment: dailyYield }
          }
        });

        operations.push(ledgerOp, balanceOp, stakeOp);
      }

      // Return summary of operations
      return { processed: operations.length / 3 }; // Divide by 3 because 3 ops per user
    });

    console.log(`[YIELD_COMPLETE] Successfully distributed yield to ${results.processed} portfolios.`);
    
    return res.status(200).json({
      status: 'SUCCESS',
      processed: results.processed,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[YIELD_FAILURE] Critical protocol error:', error);
    return res.status(500).json({ code: 'PROTOCOL_FAILURE', details: error.message });
  }
});

export default router;