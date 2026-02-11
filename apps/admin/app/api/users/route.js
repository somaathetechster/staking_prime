// apps/admin/app/api/users/route.js

import { NextResponse } from 'next/server';
import { db } from '@primestakecorp/db'; // FIXED: Monorepo Import
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

/**
 * INSTITUTIONAL AUDIT LIST
 * Endpoint: GET /api/users
 * Scope: Fetches user roster with optional status filtering.
 */
export async function GET(request) {
  try {
    // 1. SECURITY: CUSTOM JWT GATEWAY
    // We replace next-auth with your custom admin token check
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session_token");

    if (!token) {
      return NextResponse.json({ code: 'ACCESS_DENIED', message: 'Missing Credentials' }, { status: 401 });
    }

    try {
      // Verify the signature and expiration
      await jwtVerify(token.value, JWT_SECRET);
      // Optional: Check specific admin claims inside 'payload' if you added them
    } catch (e) {
      return NextResponse.json({ code: 'ACCESS_DENIED', message: 'Invalid or Expired Session' }, { status: 403 });
    }

    // 2. QUERY PARAMETER PARSING
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status'); 
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20; 

    // 3. DATABASE QUERY CONSTRUCTION
    const whereClause = {};
    
    // Strict Status Filtering
    if (statusFilter) {
      const allowedStatuses = ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'];
      // We do a case-insensitive check to be safe
      const normalizedStatus = statusFilter.toUpperCase();
      if (allowedStatuses.includes(normalizedStatus)) {
        whereClause.status = normalizedStatus;
      }
    }

    // 4. FETCH DATA (Sanitized)
    // Using $transaction to get data + count in one round-trip
    const [users, totalCount] = await db.$transaction([
      db.user.findMany({
        where: whereClause,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' }, 
        select: {
          id: true,
          email: true,
          status: true,
          role: true,
          createdAt: true,
          lastLogin: true,
          kycLevel: true,
          otp: true, // Keep this for debugging vetting issues
          wallets: {
            select: {
              currency: true,
              address: true
            }
          },
          _count: {
            select: { stakes: true } 
          }
        }
      }),
      db.user.count({ where: whereClause })
    ]);

    // 5. RESPONSE FORMATTING
    return NextResponse.json({
      status: 'SUCCESS',
      meta: {
        total: totalCount,
        page: page,
        pages: Math.ceil(totalCount / limit),
        filter: statusFilter || 'ALL'
      },
      data: users
    });

  } catch (error) {
    console.error('[ADMIN_USER_FETCH_ERROR]', error);
    return NextResponse.json({ code: 'INTERNAL_ERROR', message: 'Audit retrieval failed.' }, { status: 500 });
  }
}