'use client';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import Link from 'next/link';
import { AppPath } from '@/lib/links';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // <div>

    //   <h2>Something went wrong!</h2>
    //   <Button onClick={() => reset()}>Try again</Button>
    // </div>
    <main className="flex flex-col items-center justify-center w-full min-h-screen gap-6  text-center px-4">
      <Image src="/500-gif.gif" alt="Server error illustration" width={260} height={260} priority />

      <h1 className="text-6xl font-bold text-gray-900">Server error</h1>
      <p className="text-lg text-gray-600 max-w-md">Something went wrong!</p>
      <div className="flex gap-3 items-center">
        <Button variant="secondary" className="cursor-pointer" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild>
          <Link href={ AppPath.Home}>← Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
