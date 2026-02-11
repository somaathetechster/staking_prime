// apps/frontend/middleware.js

import { NextResponse } from 'next/server';

/**
 * INSTITUTIONAL GATEWAY MIDDLEWARE
 * Scope: Protects the core terminal from unauthorized entry.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - branding (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|pending|auth|marketing).*)',
  ],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. EXTRACT CREDENTIALS
  // In your Prisma/NextAuth setup, this comes from the encrypted JWT
  const sessionToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
  const userStatus = request.cookies.get('user_status')?.value?.toUpperCase() || 'NULL';

  // 2. UNAUTHENTICATED REDIRECT
  // If no session exists, force back to the Auth Gateway
  if (!sessionToken && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 3. THE "VETTING" HARD-STOP
  // If authenticated but not APPROVED, redirect to /pending
  // Avoid redirect loop if already on /pending
  if (sessionToken && userStatus !== 'APPROVED' && pathname !== '/pending') {
    const url = request.nextUrl.clone();
    url.pathname = '/pending';
    
    // Superior Standard: Add a diagnostic reason to the URL for the UI to read
    url.searchParams.set('reason', 'VETTING_REQUIRED');
    return NextResponse.redirect(url);
  }

  // 4. THE "ALREADY APPROVED" SHORT-CIRCUIT
  // If approved and trying to access /pending, skip to dashboard
  if (userStatus === 'APPROVED' && pathname === '/pending') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. AUTHORIZED HANDSHAKE
  const response = NextResponse.next();
  
  // Superior Standard: Inject Security Headers for Institutional Compliance
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}