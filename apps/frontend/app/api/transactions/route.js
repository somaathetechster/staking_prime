import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";
import { getServerSession } from "next-auth"; // Adjust based on your auth implementation

export async function GET() {
  try {
    // 1. SESSION SECURE (Assuming you have middleware or session helper)
    const session = await getServerSession(); 
    if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    // 2. FETCH PERSONAL LEDGER
    const logs = await db.ledger.findMany({
      where: { userId: session.user.id },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "LEDGER_UNREACHABLE" }, { status: 500 });
  }
}