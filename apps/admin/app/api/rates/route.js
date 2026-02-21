import { NextResponse } from "next/server";
import { getAdminRateData } from "../../../services/rates.service";

export async function GET() {
  try {
    // This returns the object with adminRate, marketRate, and useManual for each symbol
    const data = await getAdminRateData(['BTC', 'ETH', 'USDT']);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "FAILED_TO_FETCH_RATES" }, { status: 500 });
  }
}