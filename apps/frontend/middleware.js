import { NextResponse } from 'next/server';

// Match the routes we want to protect
export const config = {
  matcher: ['/dashboard/:path*', '/staking/:path*', '/deposit/:path*'],
};

export function middleware(request) {
  // 1. Get the user status (In a real app, you'd pull this from a JWT cookie)
  // For now, we simulate a 'pending_review' user
  const userStatus = request.cookies.get('user_status')?.value || 'pending_review';

  // 2. The Logic Gate
  if (userStatus !== 'approved') {
    const url = request.nextUrl.clone();
    url.pathname = '/pending'; // Redirect to the vetting screen
    return NextResponse.redirect(url);
  }

  // 3. If approved, let them through
  return NextResponse.next();
}