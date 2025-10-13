import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isAuthTokenPresent = (req: NextRequest): boolean =>
    !!req.cookies.get('next-auth.session-token')?.value ||
    !!req.cookies.get('__Secure-next-auth.session-token')?.value;

  if (!isAuthTokenPresent) {
    const signInUrl = new URL('/auth/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-tasks/:path*', '/settings/:path*'],
};
