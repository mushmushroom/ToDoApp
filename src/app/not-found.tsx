import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen gap-6  text-center px-4">
      <Image src="/404-gif.gif" alt="Not found illustration" width={260} height={260} priority />

      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-lg text-gray-600 max-w-md">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
        <br />
        Let’s get you back on track.
      </p>

      <Button asChild className="mt-2 px-6 py-2 text-base font-semibold">
        <Link href="/">← Back to Home</Link>
      </Button>
    </main>
  );
}
