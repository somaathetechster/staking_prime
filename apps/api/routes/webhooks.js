import express from 'express';
import { db } from '../lib/db'; // Assuming your Prisma/DB client path
import { getLiveExchangeRate } from '../services/exchangeService';

const router = express.Router();

/**
 * Helper to fetch rates based on your specific priority logic:
 * Admin Overrides > Open Exchange Rates Fallback
 */
async function getEffectiveRate(currency) {
  // 1. Check if Admin has set a manual rate for this currency in the DB
  const adminRate = await db.adminSettings.findUnique({
    where: { key: `rate_${currency}` }
  });

  if (adminRate && adminRate.value) {
    console.log(`[Rate] Using Admin Override for ${currency}: ${adminRate.value}`);
    return parseFloat(adminRate.value);
  }

  // 2. Fallback to external API (Open Exchange Rates / Tatum)
  const fallbackRate = await getLiveExchangeRate(currency);
  console.log(`[Rate] Using API Fallback for ${currency}: ${fallbackRate}`);
  return fallbackRate;
}

router.post('/tatum-deposit', async (req, res) => {
  const { accountId, amount, currency, txId, subscriptionType } = req.body;

  // Safety check for Tatum subscription types
  if (subscriptionType !== 'ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION') {
    return res.status(200).send('Ignored: Not an incoming transaction.');
  }

  try {
    // 1. Find the wallet associated with this Tatum Account ID
    const wallet = await db.wallet.findFirst({
      where: { tatumAccountId: accountId },
      include: { user: true }
    });

    if (!wallet) {
      console.error(`[Webhook] Unrecognized Account ID: ${accountId}`);
      return res.status(200).send('OK'); // Still 200 to prevent Tatum retries
    }

    // 2. Determine the conversion rate using your priority rules
    const conversionRate = await getEffectiveRate(currency);
    const amountInUSD = parseFloat(amount) * conversionRate;

    // 3. Atomic transaction: Log deposit and update balances
    await db.$transaction([
      // Create a record of the transaction for the Audit Log
      db.transaction.create({
        data: {
          userId: wallet.userId,
          type: 'DEPOSIT',
          amount: parseFloat(amount),
          currency,
          usdValue: amountInUSD,
          txHash: txId,
          status: 'COMPLETED'
        }
      }),

      // Update the user's currency-specific balance
      db.balance.upsert({
        where: { 
          userId_currency: { userId: wallet.userId, currency } 
        },
        update: { 
          amount: { increment: parseFloat(amount) } 
        },
        create: { 
          userId: wallet.userId, 
          currency, 
          amount: parseFloat(amount) 
        }
      })
    ]);

    console.log(`[Success] Credited ${amount} ${currency} ($${amountInUSD.toFixed(2)}) to User ${wallet.userId}`);

  } catch (error) {
    console.error('[Webhook Error]', error);
    // We send 200 because Tatum will keep retrying and potentially double-credit 
    // unless we handle idempotency with txId.
    return res.status(200).send('Error handled'); 
  }

  res.status(200).send('OK');
});

export default router;