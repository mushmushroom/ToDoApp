'use client';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MyTasks from '../(protected)/my-tasks/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AppPath } from '@/lib/links';
import HeaderDemo from '@/components/header/HeaderDemo';

export default function DemoPage() {
  const { data: session, status, update } = useSession();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (
      (status === 'unauthenticated' ||
        (session?.user.isDemo === false && session?.user.id?.startsWith('demo-'))) &&
      !isCreatingSession
    ) {
      setIsCreatingSession(true);

      signIn('credentials', {
        email: `demo-${uuidv4()}@example.com`,
        password: 'demo',
        redirect: false,
      }).then((result) => {
        if (result?.error) {
          console.error('Demo sign in failed:', result.error);
          setIsCreatingSession(false);
        } else if (result?.ok) {
          update().finally(() => setIsCreatingSession(false));
        }
      });
    }
  }, [status, isCreatingSession, update]);

  if (status === 'loading' || isCreatingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Creating demo session...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Initializing...</p>
      </div>
    );
  }

  if (status === 'authenticated' && session.user && !session.user.isDemo) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
        <p>You are already signed in with a regular account.</p>
        <Button asChild>
          <Link href={AppPath.MyTasks}>Go to my tasks</Link>
        </Button>
      </div>
    );
  }

  // demo session created
  return (
    <>
      <HeaderDemo />
      <main className="py-3 px-1 max-w-6xl justify-start m-auto">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={AppPath.Home}>&larr; Back to home page</Link>
        </Button>
        <div role="note" className="mb-4 bg-yellow-400 p-5 rounded-md flex items-center gap-2">
          <span>Demo account — tasks are temporary and reset every 24 hours.</span>
        </div>
        <MyTasks />
      </main>
    </>
  );
}
