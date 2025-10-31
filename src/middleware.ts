import { NextResponse, type NextRequest } from 'next/server';
import { AppPath } from './lib/links';
import { decode } from 'next-auth/jwt';

function getSessionToken(req: NextRequest) {
  return (
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value
  );
}
const isAuthTokenPresent = (req: NextRequest) => {
  const token = getSessionToken(req);
  return Boolean(token);
};

const isDemoUser = async (req: NextRequest) => {
  let token: string | undefined;
  let salt: string | undefined;

  if (req.cookies.get('authjs.session-token')?.value) {
    token = req.cookies.get('authjs.session-token')?.value;
    salt = 'authjs.session-token';
  } else if (req.cookies.get('__Secure-authjs.session-token')?.value) {
    token = req.cookies.get('__Secure-authjs.session-token')?.value;
    salt = '__Secure-authjs.session-token';
  } else if (req.cookies.get('next-auth.session-token')?.value) {
    token = req.cookies.get('next-auth.session-token')?.value;
    salt = 'next-auth.session-token';
  } else if (req.cookies.get('__Secure-next-auth.session-token')?.value) {
    token = req.cookies.get('__Secure-next-auth.session-token')?.value;
    salt = '__Secure-next-auth.session-token';
  }

  if (!token || !salt) return false;

  try {
    const decoded = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt,
    });
    return decoded?.isDemo === true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = isAuthTokenPresent(req);
  const isDemo = await isDemoUser(req);

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && [AppPath.MyTasks, AppPath.Settings].some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL(AppPath.SignIn, req.url));
  }

  // Redirect demo users from protected routes to demo page
  if (isDemo && [AppPath.MyTasks, AppPath.Settings].some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL(AppPath.Demo, req.url));
  }

  // Sign out demo users and redirect to sign-in/register page
  if (isDemo && [AppPath.SignIn, AppPath.Register].some((p) => pathname === p)) {
    const response = NextResponse.redirect(new URL(pathname, req.url));

    // Clear all possible session cookies
    const cookieOptions = {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax' as const,
    };

    response.cookies.set('authjs.session-token', '', { ...cookieOptions, maxAge: 0 });
    response.cookies.set('__Secure-authjs.session-token', '', { ...cookieOptions, maxAge: 0 });
    response.cookies.set('next-auth.session-token', '', { ...cookieOptions, maxAge: 0 });
    response.cookies.set('__Secure-next-auth.session-token', '', { ...cookieOptions, maxAge: 0 });

    return response;
  }

  // Redirect authenticated non-demo users away from sign-in/register pages
  if (
    isAuthenticated &&
    !isDemo &&
    [AppPath.SignIn, AppPath.Register].some((p) => pathname === p)
  ) {
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
    '/demo', // AppPath.Demo
  ],
};
