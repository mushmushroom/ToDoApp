'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <section className="max-w-md flex flex-col gap-5 m-auto items-center justify-center min-h-screen">
      <h1 className="text-2xl text-primary font-bold">Let’s get started!</h1>
      <p className="text-muted-foreground mb-4">Create an account to continue</p>
      <RegisterForm />
      <div className="flex gap-1 items-center text-sm justify-center ">
        <span>Already have an account?</span>
        <Button variant="link" className="text-primary" asChild>
          <Link href="/auth/sign-in">Log in here</Link>
        </Button>
      </div>
      <Button asChild variant="ghost">
        <Link href="/">Back to home page</Link>
      </Button>
    </section>
  );
}
