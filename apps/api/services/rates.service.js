// apps/api/services/rates.service.js

import axios from 'axios';
import NodeCache from 'node-cache'; // Install: npm install node-cache
import { db } from '../lib/db';

// CONFIGURATION
const RATE_CACHE = new NodeCache({ stdTTL: 60 }); // Cache rates for 60 seconds
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

// MAPPING: Internal Ticker -> CoinGecko ID
const ASSET_ID_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  TRX: 'tron'
};

/**
 * INSTITUTIONAL RATE RESOLVER
 * Hierarchy: Memory Cache > Admin Override (DB) > External Oracle (API)
 */
export const getEffectiveRate = async (ticker) => {
  const currency = ticker.toUpperCase();
  
  // 1. MEMORY CACHE CHECK (Micro-Optimization)
  // Prevents DB flooding during high traffic.
  const cachedRate = RATE_CACHE.get(currency);
  if (cachedRate) return cachedRate;

  try {
    // 2. ADMIN OVERRIDE CHECK (The "God Mode")
    // Check if the desk has manually pegged the asset.
    const adminRate = await db.adminRate.findUnique({
      where: { symbol: currency }
    });

    if (adminRate?.useManual && adminRate.manualRate > 0) {
      // Cache the manual rate too, so we don't hit DB constantly
      RATE_CACHE.set(currency, parseFloat(adminRate.manualRate));
      return parseFloat(adminRate.manualRate);
    }

    // 3. EXTERNAL ORACLE FETCH (The Fallback)
    // If no manual rate, get the live market price.
    const assetId = ASSET_ID_MAP[currency];
    if (!assetId) throw new Error(`UNSUPPORTED_ASSET: ${currency}`);

    const response = await axios.get(COINGECKO_URL, {
      params: {
        ids: assetId,
        vs_currencies: 'usd'
      },
      timeout: 5000
    });

    const liveRate = response.data[assetId]?.usd;
    
    if (!liveRate) throw new Error('ORACLE_FAILURE: No price data returned.');

    // 4. CACHE & RETURN
    RATE_CACHE.set(currency, liveRate);
    return liveRate;

  } catch (error) {
    console.error(`[RATE_ERROR] Failed to resolve ${currency}:`, error.message);
    
    // FAIL-SAFE: If everything fails, return 0 (Prevents NaN errors in math)
    // In production, you might return a "Stale" rate from the DB instead.
    return 0;
  }
};

/**
 * BATCH RESOLVER
 * Efficiently fetches rates for the entire portfolio view.
 */
export const getPortfolioRates = async (tickers = ['BTC', 'ETH', 'USDT']) => {
  const rates = {};
  // Parallel execution for speed
  await Promise.all(tickers.map(async (ticker) => {
    rates[ticker] = await getEffectiveRate(ticker);
  }));
  return rates;
};