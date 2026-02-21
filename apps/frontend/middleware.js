import { NextResponse } from 'next/server';

/**
 * INSTITUTIONAL GATEWAY MIDDLEWARE
 * Scope: Protects the core terminal from unauthorized entry and enforces the vetting protocol.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api (API routes, let the Route Handlers manage their own security)
     * - _next/static & _next/image (Next.js internals)
     * - favicon.ico (Browser icon)
     * - marketing (Public assets/pages if you have them)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|marketing).*)',
  ],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. EXTRACT CREDENTIALS
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || request.cookies.get('__Secure-next-auth.session-token')?.value;
  const userStatus = request.cookies.get('user_status')?.value?.toUpperCase() || 'NULL';

  const isAuthPage = pathname.startsWith('/auth');
  const isHomePage = pathname === '/';

  // 2. UNAUTHENTICATED ROUTING
  if (!sessionToken) {
    // If they are not logged in, and trying to access a protected route (not Home or Auth) -> Redirect to Auth
    if (!isHomePage && !isAuthPage) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    // Otherwise, let them view the Home or Auth page
    return NextResponse.next();
  }

  // 3. AUTHENTICATED ROUTING (The user has a token)

  // Prevent logged-in users from seeing the Auth screen
  if (isAuthPage) {
    if (userStatus === 'APPROVED') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/pending', request.url));
    }
  }

  // THE "VETTING" HARD-STOP
  // If authenticated but not APPROVED, force to /pending
  if (userStatus !== 'APPROVED' && pathname !== '/pending') {
    const url = request.nextUrl.clone();
    url.pathname = '/pending';
    url.searchParams.set('reason', 'VETTING_REQUIRED');
    return NextResponse.redirect(url);
  }

  // THE "ALREADY APPROVED" SHORT-CIRCUIT
  // If approved and trying to access /pending, skip to dashboard
  if (userStatus === 'APPROVED' && pathname === '/pending') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. AUTHORIZED HANDSHAKE
  const response = NextResponse.next();
  
  // Superior Standard: Inject Security Headers for Institutional Compliance
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}