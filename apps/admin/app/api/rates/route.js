import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    BTC: { rate: 98420.00, change: 2.4 },
    ETH: { rate: 2840.00, change: -1.2 },
    USDT: { rate: 1.00, change: 0.0 }
  });
}