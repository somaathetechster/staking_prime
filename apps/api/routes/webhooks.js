import express from 'express';
import { db } from '../lib/db';
import { getEffectiveRate } from '../services/rates.service'; // Using your new rate service
import crypto from 'crypto';
import { z } from 'zod';

const router = express.Router();

// INSTITUTIONAL CONFIGURATION
const TATUM_HMAC_SECRET = process.env.TATUM_HMAC_SECRET; // Must be set in .env
const REQUIRED_CONFIRMATIONS = 2; // Safety threshold for block finality

/**
 * INSTITUTIONAL SETTLEMENT ENGINE
 * Endpoint: POST /api/webhooks/tatum-deposit
 * Protocol: HMAC-SHA512 Signature Verification -> Idempotency Check -> Atomic Ledger Settlement
 */
router.post('/tatum-deposit', async (req, res) => {
  const timestamp = new Date().toISOString();
  
  try {
    // 1. CRYPTOGRAPHIC SIGNATURE VERIFICATION (The "Seal")
    // Tatum sends an HMAC signature in the headers. We verify it to ensure the request is actually from them.
    const signature = req.headers['x-payload-hash'];
    if (!signature) {
      console.warn(`[SECURITY_BREACH] Unsigned webhook attempt from ${req.ip}`);
      return res.status(403).json({ code: 'UNAUTHORIZED_SIGNATURE_MISSING' });
    }

    const computedHash = crypto
      .createHmac('sha512', TATUM_HMAC_SECRET)
      .update(JSON.stringify(req.body))
      .digest('base64');

    if (signature !== computedHash) {
      console.error(`[SECURITY_FAIL] Signature mismatch. Possible tampering.`);
      return res.status(403).json({ code: 'INVALID_SIGNATURE' });
    }

    // 2. SURGICAL PAYLOAD VALIDATION
    const schema = z.object({
      accountId: z.string(),
      amount: z.string(), // Blockchain amounts are strings to avoid float errors
      currency: z.string(),
      txId: z.string(),
      subscriptionType: z.enum(['ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION', 'OFFCHAIN_TRANSACTION']),
      blockNumber: z.number().optional(),
    });

    const payload = schema.parse(req.body);

    // 3. IDEMPOTENCY LOCK (The "Double-Spend" Guard)
    // We check if this specific Transaction Hash (txId) has already been processed.
    const existingLedger = await db.ledger.findUnique({
      where: { txId: payload.txId }
    });

    if (existingLedger) {
      console.log(`[IDEMPOTENCY] Transaction ${payload.txId} already settled. Skipping.`);
      return res.status(200).send('ALREADY_PROCESSED');
    }

    // 4. INFRASTRUCTURE LOOKUP
    const wallet = await db.wallet.findFirst({
      where: { tatumAccountId: payload.accountId },
      include: { user: true }
    });

    if (!wallet) {
      console.error(`[ORPHAN_TX] No wallet found for AccountID: ${payload.accountId}`);
      // We return 200 to tell Tatum "We got it, stop sending" even though we can't process it.
      return res.status(200).send('WALLET_NOT_FOUND');
    }

    // 5. EFFECTIVE RATE RESOLUTION
    // We fetch the rate specifically for this settlement moment.
    const conversionRate = await getEffectiveRate(payload.currency);
    const usdValue = parseFloat(payload.amount) * conversionRate;

    // 6. ATOMIC SETTLEMENT TRANSACTION
    // This either happens completely or not at all.
    await db.$transaction(async (tx) => {
      
      // A. Create Immutable Ledger Entry
      await tx.ledger.create({
        data: {
          userId: wallet.userId,
          type: 'DEPOSIT',
          amount: parseFloat(payload.amount),
          currency: payload.currency.toUpperCase(),
          usdValue: usdValue,
          txId: payload.txId,
          status: 'COMPLETED',
          rateUsed: conversionRate, // Audit trail: What was the rate at this second?
          metadata: {
            provider: 'TATUM',
            blockHeight: payload.blockNumber,
            timestamp
          }
        }
      });

      // B. Update User "Available Balance"
      // We assume your User model has a generic 'balance' or specific currency balances
      // Here we update the specific asset balance logic
      await tx.balance.upsert({
        where: { 
          userId_currency: { 
            userId: wallet.userId, 
            currency: payload.currency.toUpperCase() 
          } 
        },
        update: { 
          amount: { increment: parseFloat(payload.amount) },
          updatedAt: new Date()
        },
        create: {
          userId: wallet.userId,
          currency: payload.currency.toUpperCase(),
          amount: parseFloat(payload.amount)
        }
      });

      // C. Optional: Notify Admin of High-Value Deposit
      if (usdValue > 10000) {
        // triggerAdminAlert(`High Value Deposit: $${usdValue} from User ${wallet.userId}`);
      }
    });

    console.log(`[SETTLEMENT_COMPLETE] Tx: ${payload.txId} | User: ${wallet.userId} | +${payload.amount} ${payload.currency}`);
    return res.status(200).json({ status: 'SETTLED' });

  } catch (error) {
    console.error('[SETTLEMENT_FAILURE]', error);
    
    // Zod Validation Errors -> 400 (Bad Request), Tatum shouldn't retry malformed data
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_PAYLOAD' });
    }

    // Database/Network Errors -> 500 (Internal Server Error), Tatum SHOULD retry
    return res.status(500).send('SETTLEMENT_ERROR'); 
  }
});

export default router;