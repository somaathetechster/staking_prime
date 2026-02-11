// apps/admin/app/api/services/wallet.service.js

import axios from 'axios';
import { db } from '@primestakecorp/db'; // FIXED: Correct Monorepo Import

// INSTITUTIONAL CONFIGURATION
const TATUM_API_KEY = process.env.TATUM_API_KEY;
const TATUM_URL = process.env.TATUM_URL || 'https://api.tatum.io/v3';
const MAX_RETRIES = 3;

// DEDICATED API CLIENT
const tatumClient = axios.create({
  baseURL: TATUM_URL,
  headers: { 
    'x-api-key': TATUM_API_KEY,
    'Content-Type': 'application/json' 
  },
  timeout: 10000 
});

const CURRENCY_MAP = {
  BTC: 'BTC',
  ETH: 'ETH',
  USDT: 'USDT_TRON', 
  USDC: 'USDC'
};

/**
 * GENERATE_SECURE_WALLET_INFRASTRUCTURE
 */
export const generateUserWallet = async (userId, ticker) => {
  const currency = CURRENCY_MAP[ticker] || ticker;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      console.log(`[INFRA_INIT] Provisioning ${currency} vault for User: ${userId} (Attempt ${attempt + 1})`);

      // 1. IDEMPOTENCY CHECK
      const existingWallet = await db.wallet.findFirst({
        where: { userId, currency: ticker }
      });

      if (existingWallet) {
        console.log(`[INFRA_EXISTS] Returning existing vault for User: ${userId}`);
        return {
          tatumAccountId: existingWallet.tatumAccountId,
          address: existingWallet.address
        };
      }

      // 2. CREATE VIRTUAL ACCOUNT (Tatum Ledger)
      // This creates the off-chain balance record
      const accountResponse = await tatumClient.post('/ledger/account', {
        currency: currency,
        customer: { externalId: userId },
        compliant: false, 
        accountCode: `PRIME_${ticker}_${userId.substring(0, 8)}`, 
        accountingCurrency: 'USD'
      });

      const tatumAccountId = accountResponse.data.id;

      // 3. GENERATE DEPOSIT ADDRESS
      // This creates the crypto address linked to the Ledger Account
      const addressResponse = await tatumClient.post(`/offchain/account/${tatumAccountId}/address`);

      console.log(`[INFRA_SUCCESS] Vault Active. ID: ${tatumAccountId}`);

      return {
        tatumAccountId: tatumAccountId,
        address: addressResponse.data.address,
        currency: ticker, 
        derivationKey: addressResponse.data.derivationKey 
      };

    } catch (error) {
      console.error(`[INFRA_FAILURE] Attempt ${attempt + 1} Failed:`, error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        throw new Error("API_KEY_INVALID: Check provider credentials.");
      }
      
      attempt++;
      if (attempt >= MAX_RETRIES) {
        // Fallback: If API fails, throw specific error so Vetting logic can handle it
        throw new Error(`VAULT_PROVISION_FAILED: ${currency} infrastructure unreachable.`);
      }
      
      // Exponential Backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
};

export const auditWalletBalance = async (tatumAccountId) => {
  try {
    const { data } = await tatumClient.get(`/ledger/account/${tatumAccountId}`);
    return {
      available: parseFloat(data.balance.available),
      total: parseFloat(data.balance.accountBalance)
    };
  } catch (error) {
    console.error("[AUDIT_FAILURE] Could not verify remote balance:", error.message);
    return null; 
  }
};