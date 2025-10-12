// export { auth as middleware } from '@/config/auth';

import { auth } from '@/lib/config/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL('/auth/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/my-tasks/:path*', '/settings/:path*'],
};
