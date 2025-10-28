import { NextResponse, type NextRequest } from 'next/server';
import { AppPath } from './lib/links';

const isAuthTokenPresent = (req: NextRequest) => {
  const token =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;
  return Boolean(token);
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = isAuthTokenPresent(req);

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && [AppPath.MyTasks, AppPath.Settings].some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL(AppPath.SignIn, req.url));
  }

  // Redirect authenticated users away from sign-in/register pages
  if (isAuthenticated && [AppPath.SignIn, AppPath.Register].some((p) => pathname === p)) {
    return NextResponse.redirect(new URL(AppPath.MyTasks, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', // AppPath.Home
    '/auth/sign-in', // AppPath.SignIn
    '/auth/register', // AppPath.Register
    '/my-tasks', // AppPath.MyTasks
    '/my-tasks/:path*',
    '/settings',
    '/settings/:path*',
  ],
};
