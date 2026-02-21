import axios from 'axios';
import NodeCache from 'node-cache';
import { db } from '../lib/db';

// CONFIGURATION
const RATE_CACHE = new NodeCache({ stdTTL: 60 }); 
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

const ASSET_ID_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  TRX: 'tron'
};

/**
 * FETCH MARKET PRICE
 * Internal helper to get the "clean" market price from the Oracle.
 */
const fetchMarketPrice = async (ticker) => {
  const currency = ticker.toUpperCase();
  const assetId = ASSET_ID_MAP[currency];
  
  if (!assetId) return 0;

  try {
    const response = await axios.get(COINGECKO_URL, {
      params: { ids: assetId, vs_currencies: 'usd' },
      timeout: 5000
    });
    return response.data[assetId]?.usd || 0;
  } catch (err) {
    console.error(`[ORACLE_ERROR] ${currency}:`, err.message);
    return 0;
  }
};

/**
 * GET ADMIN DATA PACK
 * Used by the Admin API to populate the Currency Manager UI.
 */
export const getAdminRateData = async (tickers = ['BTC', 'ETH', 'USDT']) => {
  const results = {};

  await Promise.all(tickers.map(async (symbol) => {
    // 1. Get the current settings from the Database
    const adminRecord = await db.adminRate.findUnique({
      where: { symbol }
    });

    // 2. Fetch the actual market price (Oracle)
    // We don't use cache here to ensure Admin sees the freshest spread
    const marketRate = await fetchMarketPrice(symbol);

    results[symbol] = {
      marketRate: marketRate,
      adminRate: adminRecord?.manualRate || marketRate, // Fallback to market if no record
      useManual: adminRecord?.useManual || false,
    };
  }));

  return results;
};

/**
 * GET EFFECTIVE RATE (The User View)
 * Used for financial calculations. Returns the single "active" price.
 */
export const getEffectiveRate = async (ticker) => {
  const currency = ticker.toUpperCase();
  
  // 1. Cache Check
  const cached = RATE_CACHE.get(currency);
  if (cached) return cached;

  try {
    // 2. Database Check
    const adminRate = await db.adminRate.findUnique({
      where: { symbol: currency }
    });

    // 3. Logic: If manual is ON and exists, use it. Else, fetch market.
    if (adminRate?.useManual && adminRate.manualRate > 0) {
      const rate = parseFloat(adminRate.manualRate);
      RATE_CACHE.set(currency, rate);
      return rate;
    }

    const liveRate = await fetchMarketPrice(currency);
    RATE_CACHE.set(currency, liveRate);
    return liveRate;

  } catch (error) {
    return 0;
  }
};