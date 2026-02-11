import express from 'express';
import { db } from '../lib/db'; 
import { generateUserWallet } from '../services/wallet.service';
import { isAdmin } from '../middleware/isAdmin';
import { z } from 'zod'; // Institutional-grade validation

const router = express.Router();

/**
 * INSTITUTIONAL_VETTING_PROTOCOL
 * Atomic operation: Status Flip + Infrastructure Provisioning
 */
router.post('/approve/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Transactional Integrity: All infrastructure must lock together
    const result = await db.$transaction(async (tx) => {
      
      // Update User Status (Normalized to uppercase for Middleware consistency)
      const user = await tx.user.update({
        where: { id: userId },
        data: { status: 'APPROVED' }
      });

      // 2. Provision Assets via External Gateway (Tatum/Wallet Service)
      const btcData = await generateUserWallet(userId, 'BTC');
      const usdtData = await generateUserWallet(userId, 'USDT_TRON');

      // 3. Store Infrastructure Data
      await tx.wallet.createMany({
        data: [
          { 
            userId, 
            currency: 'BTC', 
            address: btcData.address, 
            tatumAccountId: btcData.tatumAccountId 
          },
          { 
            userId, 
            currency: 'USDT', 
            address: usdtData.address, 
            tatumAccountId: usdtData.tatumAccountId 
          }
        ]
      });

      // 4. Initialize Ledger Position (Zero-point Audit)
      await tx.ledger.create({
        data: {
          userId,
          type: 'SYSTEM_INIT',
          amount: 0,
          currency: 'USD',
          status: 'COMPLETED',
          metadata: { message: "Vault provisioned for institutional principal." }
        }
      });

      return user;
    }, {
      timeout: 15000 // Extended timeout for external wallet generation
    });

    return res.status(200).json({ 
      status: 'SUCCESS', 
      code: 'INFRA_PROVISIONED',
      data: { userId: result.id } 
    });

  } catch (error) {
    console.error("CRITICAL_VETTING_FAILURE:", error);
    return res.status(500).json({ 
      status: 'ERROR', 
      code: 'ATOMIC_PROVISION_FAILED',
      detail: "Rollback initiated. User status remains PENDING." 
    });
  }
});

/**
 * CURRENCY_DESK_PROTOCOL
 * Management of hierarchical manual rates
 */
router.post('/rates', isAdmin, async (req, res) => {
  const schema = z.object({
    symbol: z.string().min(3).max(5),
    rate: z.number().positive(),
    useManual: z.boolean().default(true)
  });

  try {
    const { symbol, rate, useManual } = schema.parse(req.body);
    
    const rateData = await db.adminRate.upsert({
      where: { symbol: symbol.toUpperCase() },
      update: { 
        manualRate: rate, 
        useManual,
        updatedAt: new Date() 
      },
      create: { 
        symbol: symbol.toUpperCase(), 
        manualRate: rate,
        useManual 
      }
    });

    return res.json({ status: 'SUCCESS', data: rateData });
  } catch (error) {
    return res.status(400).json({ status: 'ERROR', code: 'RATE_UPDATE_INVALID' });
  }
});

export default router;