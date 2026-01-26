'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useVerifyEmail } from '@/lib/hooks/useVerifyEmail';
import { AppPath } from '@/lib/links';
import { Button } from '@/components/ui/button';
import ResendForm from '@/components/auth/ResendForm';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');

  const { mutate, isPending, isError } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      toast.error('Invalid verification link');
      return;
    }

    mutate(token, {
      onSuccess: () => {
        toast.success('Email verified successfully! Redirecting to sign in page...');
        setTimeout(() => {
          router.push(AppPath.SignIn);
        }, 5000);
      },
      onError: (err: any) => {
        toast.error(err.message || 'Verification failed');
      },
    });
  }, [token, mutate, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {!isError && <h1 className="text-xl font-semibold mb-2">Verifying your email…</h1>}
        {isPending && <p>Please wait</p>}
        {isError && <ResendForm />}
        <Button asChild variant="link" className="mt-2">
          <Link href={AppPath.Home}>Back to main page</Link>
        </Button>
      </div>
    </div>
  );
}
