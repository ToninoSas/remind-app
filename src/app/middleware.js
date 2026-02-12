import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // Rotte che non richiedono login
  const isPublicRoute = pathname === '/login' || pathname === '/register' || pathname === '/';

  // Se non è loggato e non è in una pagina pubblica -> Login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};