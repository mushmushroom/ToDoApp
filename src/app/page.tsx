import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/lib/config/auth';
import { AppPath } from '@/lib/links';

export default async function Home() {
  const session = await auth();
  const isAuthenticated = session?.user && !session.user.isDemo;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 max-w-6xl w-full">
        {/* Text */}
        <div className="md:max-w-md text-center md:text-left">
          <h1 className="font-extrabold text-3xl md:text-4xl mb-4">
            Organize your day, achieve more.
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-6">
            Stay focused and productive with a simple, powerful to-do list that helps you plan
            tasks, track progress, and reach your goals — all in one place.
          </p>
          {isAuthenticated ? (
            <Button asChild>
              <Link href={AppPath.MyTasks}>Go to my tasks</Link>
            </Button>
          ) : (
            <div className="flex gap-3 items-center justify-center md:justify-start">
              <Button asChild className="px-6 py-3">
                <Link href={AppPath.SignIn}>Log in</Link>
              </Button>
              <div>
                {/* or view
                <Button variant="link" asChild>
                  <Link href={AppPath.Demo}>Live Demo</Link>
                </Button> */}
              </div>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <Image
            src="/home-img.svg"
            width={400}
            height={400}
            alt="Home page illustration"
            className="w-full max-w-sm md:max-w-full"
          />
        </div>
      </div>
    </main>
  );
}
