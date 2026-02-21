import { NextResponse } from "next/server";
import { db } from "@primestakecorp/db";

export async function GET() {
  try {
    const users = await db.user.findMany({
      where: { NOT: { status: 'PENDING_REVIEW' } }, // Only show vetted users
      include: {
        balances: true,
        stakes: {
          where: { status: 'ACTIVE' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "ROSTER_FETCH_FAILED" }, { status: 500 });
  }
}