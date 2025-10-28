'use client';
// import { auth } from '@/config/auth';
import { ReCaptchaProvider } from 'react-enterprise-recaptcha';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
  // const session = await auth();
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          language="en"
          defaultAction="default"
        >
          {children}
        </ReCaptchaProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
