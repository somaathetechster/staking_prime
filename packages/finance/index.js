// packages/finance/index.js
import { db } from "../../apps/api/lib/db"; // Adjust path to your Prisma client

/**
 * Resolves the exchange rate based on user-defined priority:
 * 1. Admin Manual Rate (if useManual is enabled)
 * 2. External API (Fallback)
 */
export async function getEffectiveRate(symbol) {
  const config = await db.currencyConfig.findUnique({
    where: { symbol }
  });

  // Check if Admin set this to "Main"
  if (config?.useManual && config?.adminRate) {
    return config.adminRate;
  }

  // Fallback: This is where you call Open Exchange Rates or Tatum
  return await fetchMarketRate(symbol);
}

async function fetchMarketRate(symbol) {
  // Logic for your external API call goes here
  // Example return:
  return 98500.00; 
}