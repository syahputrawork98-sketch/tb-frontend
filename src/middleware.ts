import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('tb_token')?.value;
  const role = request.cookies.get('tb_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Root redirect logic
  if (pathname === '/') {
    if (token) {
      const target = role === 'ADMIN' ? '/admin/analytics' : '/cs/pos';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If trying to access dashboard but no token, redirect to login
  if ((pathname.startsWith('/admin') || pathname.startsWith('/cs')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. If logged in and trying to access login page, redirect to their dashboard
  if (pathname === '/login' && token) {
    const target = role === 'ADMIN' ? '/admin/analytics' : '/cs/pos';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 4. Role-based protection (BREAK LOOPS)
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/cs') && role !== 'CS') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/admin/:path*', '/cs/:path*', '/login'],
};
