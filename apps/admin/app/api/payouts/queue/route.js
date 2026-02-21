import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";

export async function GET() {
  try {
    const pendingPayouts = await db.ledger.findMany({
      where: {
        type: 'WITHDRAWAL',
        status: 'PENDING'
      },
      include: {
        user: {
          select: { email: true, id: true }
        }
      },
      orderBy: { createdAt: 'asc' } // Oldest first (FIFO)
    });

    return NextResponse.json(pendingPayouts);
  } catch (error) {
    return NextResponse.json({ error: "QUEUE_OFFLINE" }, { status: 500 });
  }
}