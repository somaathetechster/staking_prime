import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";

export async function GET() {
  try {
    // We pull the last 20 events from the ledger
    const activities = await db.ledger.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "FEED_OFFLINE" }, { status: 500 });
  }
}