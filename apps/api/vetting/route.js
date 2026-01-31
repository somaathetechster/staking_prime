import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your Prisma client instance

export async function POST(request) {
  const { userId, action } = await request.json();

  const newStatus = action === 'approved' ? 'APPROVED' : 'REJECTED';

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }
}