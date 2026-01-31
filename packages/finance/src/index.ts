/**
 * Core Exchange Rate Engine
 * Priority: Admin Rate > API Fallback
 */
export interface ExchangeRateData {
  adminRate: number | null;
  marketRate: number;
}

export function getEffectiveRate(data: ExchangeRateData): number {
  // If admin has set a rate (even if it's 0 for some reason), use it.
  // We use null to signify "No Admin Override"
  if (data.adminRate !== null) {
    return data.adminRate;
  }
  
  // Fallback to market rate
  return data.marketRate;
}

export function convertToUSD(amount: number, rateData: ExchangeRateData): number {
  const rate = getEffectiveRate(rateData);
  return amount * rate;
}

// User Status Gating (Shared across API & Frontend)
export type UserStatus = 'pending_review' | 'approved' | 'rejected' | 'suspended';