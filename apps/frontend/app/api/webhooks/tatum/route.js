import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import { getEffectiveRate } from "../../../../services/rates.service";
import crypto from 'crypto';
import { z } from 'zod';

const TATUM_HMAC_SECRET = process.env.TATUM_HMAC_SECRET;

export async function POST(request) {
  const timestamp = new Date().toISOString();
  
  try {
    // 1. READ RAW BODY FOR SIGNATURE VERIFICATION
    // Next.js consumes the body, so we need the text for HMAC
    const rawBody = await request.text();
    const signature = request.headers.get('x-payload-hash');

    if (!signature || !TATUM_HMAC_SECRET) {
      console.warn(`[SECURITY_ALERT] Webhook signature missing or secret unconfigured.`);
      return new NextResponse('FORBIDDEN', { status: 403 });
    }

    // 2. CRYPTOGRAPHIC HANDSHAKE
    const computedHash = crypto
      .createHmac('sha512', TATUM_HMAC_SECRET)
      .update(rawBody)
      .digest('base64');

    if (signature !== computedHash) {
      console.error(`[SECURITY_FAIL] HMAC mismatch detected.`);
      return new NextResponse('INVALID_SIGNATURE', { status: 403 });
    }

    // 3. PARSE PAYLOAD
    const body = JSON.parse(rawBody);
    const schema = z.object({
      accountId: z.string(),
      amount: z.string(),
      currency: z.string(),
      txId: z.string(),
      subscriptionType: z.string(),
      blockNumber: z.number().optional(),
    });

    const payload = schema.parse(body);

    // 4. IDEMPOTENCY CHECK
    const existingLedger = await db.ledger.findUnique({
      where: { txId: payload.txId }
    });

    if (existingLedger) {
      return new NextResponse('ALREADY_SETTLED', { status: 200 });
    }

    // 5. INFRASTRUCTURE LOOKUP
    const wallet = await db.wallet.findFirst({
      where: { tatumAccountId: payload.accountId }
    });

    if (!wallet) {
      console.error(`[ORPHAN_TX] No wallet linked to Tatum Account: ${payload.accountId}`);
      return new NextResponse('OK', { status: 200 }); // Tell Tatum to stop retrying
    }

    // 6. RATE RESOLUTION
    const conversionRate = await getEffectiveRate(payload.currency);
    const usdValue = parseFloat(payload.amount) * conversionRate;

    // 7. ATOMIC SETTLEMENT
    await db.$transaction(async (tx) => {
      // Create Ledger Entry
      await tx.ledger.create({
        data: {
          userId: wallet.userId,
          type: 'DEPOSIT',
          amount: parseFloat(payload.amount),
          currency: payload.currency.toUpperCase(),
          usdValue: usdValue,
          txId: payload.txId,
          status: 'COMPLETED',
          rateUsed: conversionRate,
          metadata: { provider: 'TATUM', timestamp }
        }
      });

      // Update Specific Balance
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
    });

    console.log(`[SETTLEMENT_SUCCESS] User: ${wallet.userId} | +${payload.amount} ${payload.currency}`);
    return NextResponse.json({ status: 'SETTLED' });

  } catch (error) {
    console.error('[WEBHOOK_FAILURE]', error.message);
    if (error instanceof z.ZodError) return new NextResponse('BAD_REQUEST', { status: 400 });
    return new NextResponse('RETRY_LATER', { status: 500 });
  }
}