// apps/frontend/services/wallet.service.js

import axios from 'axios';
import { db } from '@primestakecorp/db';

// INSTITUTIONAL CONFIGURATION
const TATUM_API_KEY = process.env.TATUM_API_KEY;
const TATUM_URL = process.env.TATUM_URL || 'https://api.tatum.io/v3';
const MAX_RETRIES = 3;

/**
 * DEDICATED API CLIENT
 * Configured with timeouts and audit logging interceptors.
 */
const tatumClient = axios.create({
  baseURL: TATUM_URL,
  headers: { 
    'x-api-key': TATUM_API_KEY,
    'Content-Type': 'application/json' 
  },
  timeout: 10000 // 10s Hard Timeout to prevent hanging processes
});

/**
 * CURRENCY NORMALIZATION PROTOCOL
 * Maps internal tickers to Tatum's specific infrastructure codes.
 */
const CURRENCY_MAP = {
  BTC: 'BTC',
  ETH: 'ETH',
  USDT: 'USDT_TRON', // Defaulting to TRC20 for speed/low-cost
  USDC: 'USDC'
};

/**
 * GENERATE_SECURE_WALLET_INFRASTRUCTURE
 * Orchestrates the creation of a Virtual Account and an Off-Chain Deposit Address.
 */
export const generateUserWallet = async (userId, ticker) => {
  const currency = CURRENCY_MAP[ticker] || ticker;
  let attempt = 0;

  // RETRY LOOP FOR NETWORK RESILIENCE
  while (attempt < MAX_RETRIES) {
    try {
      console.log(`[INFRA_INIT] Provisioning ${currency} vault for User: ${userId} (Attempt ${attempt + 1})`);

      // 1. IDEMPOTENCY CHECK (Local)
      // Ensure we haven't already generated this wallet locally to save API costs
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

      // 2. CREATE VIRTUAL ACCOUNT (The "Vault")
      // This creates a ledger entry in Tatum's system linked to your User ID.
      const accountResponse = await tatumClient.post('/ledger/account', {
        currency: currency,
        customer: {
          externalId: userId // STRICT LINKING: Binds Tatum Customer to Primestake User
        },
        compliant: false, // Set to true if you need Tatum's built-in KYT (Know Your Transaction)
        accountCode: `PRIME_${ticker}_${userId.substring(0, 8)}`, // Audit Tag
        accountingCurrency: 'USD'
      });

      const tatumAccountId = accountResponse.data.id;

      // 3. GENERATE DEPOSIT ADDRESS (The "Gateway")
      // We generate the public-facing address that funnels funds into the Vault.
      const addressResponse = await tatumClient.post(`/offchain/account/${tatumAccountId}/address`);

      console.log(`[INFRA_SUCCESS] Vault Active. ID: ${tatumAccountId}`);

      return {
        tatumAccountId: tatumAccountId,
        address: addressResponse.data.address,
        currency: ticker, // Return the internal ticker (e.g., USDT), not the provider code (USDT_TRON)
        derivationKey: addressResponse.data.derivationKey // Store for key recovery audits
      };

    } catch (error) {
      console.error(`[INFRA_FAILURE] Attempt ${attempt + 1} Failed:`, error.response?.data || error.message);
      
      // ERROR HANDLING STRATEGY
      if (error.response?.status === 403) {
        throw new Error("API_KEY_INVALID: Check provider credentials.");
      }
      
      // If it's a "Duplicate" error (409), we might need to fetch the existing account
      // For now, we retry standard network errors.
      attempt++;
      if (attempt >= MAX_RETRIES) {
        throw new Error(`VAULT_PROVISION_FAILED: ${currency} infrastructure unreachable.`);
      }
      
      // Exponential Backoff: Wait 1s, then 2s, then 4s...
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
};

/**
 * UTILITY: FETCH LIVE BALANCE
 * Direct audit of the off-chain vault to verify local ledger accuracy.
 */
export const auditWalletBalance = async (tatumAccountId) => {
  try {
    const { data } = await tatumClient.get(`/ledger/account/${tatumAccountId}`);
    return {
      available: parseFloat(data.balance.available),
      total: parseFloat(data.balance.accountBalance)
    };
  } catch (error) {
    console.error("[AUDIT_FAILURE] Could not verify remote balance:", error.message);
    return null; // Fail safe
  }
};