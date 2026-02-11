import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export const config = {
  // Protect everything except login, public assets, and specific API routes
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('admin_session_token')?.value;

  // 1. PUBLIC GATE: If accessing login with a valid token, redirect to dashboard
  if (pathname === '/login') {
    if (sessionToken) {
      try {
        await jwtVerify(sessionToken, JWT_SECRET);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (e) {
        // Invalid token, allow them to stay on login page
      }
    }
    return NextResponse.next();
  }

  // 2. PROTECTED GATE: If no token exists, bounce to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. CRYPTOGRAPHIC VERIFICATION: Ensure the token hasn't been tampered with
  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);

    // Strict Authority Check: Ensure the user is actually an ADMIN
    if (payload.role !== 'ADMIN') {
       const response = NextResponse.redirect(new URL('/login', request.url));
       response.cookies.delete('admin_session_token'); // Purge unauthorized token
       return response;
    }

    return NextResponse.next();
  } catch (error) {
    // Token is expired, malformed, or invalid
    console.error("[MIDDLEWARE_AUTH_ERROR]:", error.message);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('admin_session_token');
    return response;
  }
}