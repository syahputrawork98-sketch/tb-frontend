import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('tb_token')?.value;
  const role = request.cookies.get('tb_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access dashboard but no token, redirect to login
  if ((pathname.startsWith('/admin') || pathname.startsWith('/cs')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If logged in and trying to access login page, redirect to their dashboard
  if (pathname === '/login' && token) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/analytics', request.url));
    }
    return NextResponse.redirect(new URL('/cs/pos', request.url));
  }

  // 3. Role-based protection
  // Admin cannot access CS-only pages (if any) and vice-versa
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/cs/pos', request.url));
  }

  if (pathname.startsWith('/cs') && role !== 'CS') {
    return NextResponse.redirect(new URL('/admin/analytics', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/cs/:path*', '/login'],
};
