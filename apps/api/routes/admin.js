import express from 'express';
import { db } from '../lib/db'; // Your database client
import { generateUserWallet } from '../services/wallet.service';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

/**
 * APPROVE USER & PROVISION WALLETS
 * Triggered by the "Approve" button in your Admin Dashboard
 */
router.post('/approve/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Update status
    const user = await db.user.update({
      where: { id: userId },
      data: { status: 'approved' }
    });

    // 2. Generate unique addresses (BTC & TRON for USDT)
    const btcData = await generateUserWallet(userId, 'BTC');
    const usdtData = await generateUserWallet(userId, 'USDT_TRON');

    // 3. Store in user_wallets table
    await db.user_wallets.createMany({
      data: [
        { userId, currency: 'BTC', address: btcData.address, accountId: btcData.tatumAccountId },
        { userId, currency: 'USDT', address: usdtData.address, accountId: usdtData.tatumAccountId }
      ]
    });

    return res.json({ success: true, message: "User approved and wallets ready." });
  } catch (error) {
    console.error("Admin Approval Error:", error);
    return res.status(500).json({ error: "Failed to provision user infrastructure." });
  }
});

/**
 * UPDATE GLOBAL ADMIN RATES
 * Triggered by your Currency Manager UI
 */
router.post('/rates', isAdmin, async (req, res) => {
  const { symbol, rate } = req.body; // e.g., { symbol: 'BTC', rate: 105000 }
  
  await db.admin_rates.upsert({
    where: { symbol },
    update: { rate, updatedAt: new Date() },
    create: { symbol, rate }
  });

  return res.json({ success: true });
});

export default router;