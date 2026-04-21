import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('auth_session')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';

  // Not authenticated → force to login page
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Already authenticated → don't show login page again
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all pages except API routes, Next.js internals and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
