import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // On définit les routes publiques qui n'ont pas besoin d'authentification
  const isPublicPath = path === '/login' || path.startsWith('/api/');

  // Récupération de notre faux "token" depuis les cookies (créé dans le auth.ts server action)
  const isAuth = request.cookies.get('auth_session')?.value;

  if (!isPublicPath && !isAuth) {
    // Si la route est privée et qu'on n'est pas connecté => Go /login
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicPath && isAuth && path === '/login') {
    // Si on est déjà loggé et qu'on essaie d'aller sur /login => Go /
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Le middleware s'exécute sur toutes les pages sauf les images, scripts statiques
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
