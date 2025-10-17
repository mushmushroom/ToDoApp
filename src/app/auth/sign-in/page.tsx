'use client';
import { Button } from '@/components/ui/button';
import LoginWithGithub from '@/components/auth/LoginWithGithub';
import Link from 'next/link';
import LoginWithGoogle from '@/components/auth/LoginWithGoogle';
import LoginForm from '@/components/auth/LoginForm';
import { Separator } from '@/components/ui/separator';

export default function SignInPage() {
  return (
    <section className="max-w-md flex flex-col gap-5 m-auto items-center justify-center min-h-screen">
      <h1 className="text-2xl text-primary font-bold">Welcome back!</h1>
      <p className="text-muted-foreground mb-4">Sign in to continue</p>
      <LoginWithGithub />
      <LoginWithGoogle />
      <Separator />
      <LoginForm />
      <div className="flex gap-1 items-center text-sm justify-center">
        <span>Do not have an account yet?</span>
        <Button variant="link" className="text-primary" asChild>
          <Link href="/auth/register">Click here to create one!</Link>
        </Button>
      </div>
      <Button asChild variant="ghost">
        <Link href="/">Back to home page</Link>
      </Button>
    </section>
  );
}
