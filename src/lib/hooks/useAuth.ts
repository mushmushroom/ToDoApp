'use client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReCaptcha } from 'react-enterprise-recaptcha';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AppPath } from '../links';
import { API_URL } from '../constants';
import { useState } from 'react';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password should contain at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterInputs = z.infer<typeof registerSchema>;

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInInputs = z.infer<typeof signInSchema>;

export default function useAuth() {
  const [verifiedEmail, setVerifiedEmail] = useState(true);
  const router = useRouter();
  // create user
  async function createUser(
    email: string,
    password: string,
    captchaToken: string,
    onSuccess?: () => void,
  ) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Failed to register');
        return;
      }
      toast.success('Success! Please check your inbox for a verification email.');
      resetRegister();
    } catch (error) {
      console.log((error as Error).message);
      toast.error('Something went wrong. Try again later.');
    }
  }

  // captcha
  const { executeRecaptcha, isError: isRecaptchaError } = useReCaptcha();

  // register form
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    reset: resetRegister,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm<RegisterInputs>({ resolver: zodResolver(registerSchema), mode: 'onChange' });

  // register function
  async function onSubmitRegister({ email, password }: RegisterInputs) {
    if (!executeRecaptcha) {
      toast.error('Captcha not ready. Please try again later.');
      return;
    }

    let token: string;
    try {
      token = await executeRecaptcha('register_submit');
    } catch {
      toast.error('CAPTCHA failed. Please try again later.');
      return;
    }
    await createUser(email, password, token, resetRegister);
  }

  // sign in form
  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    reset: resetSignIn,
    watch: watchSignIn,
    formState: { errors: errorsSignIn, isSubmitting: isSignInSubmitting },
  } = useForm<SignInInputs>({ resolver: zodResolver(signInSchema), mode: 'onChange' });

  // sign in function
  async function onSubmitSignIn({ email, password }: SignInInputs) {
    const resVerified = await fetch('/api/check-email-verified', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    const data = await resVerified.json();

    if (data.exists && !data.verified) {
      setVerifiedEmail(false);
      toast.error('Please verify your email before signing in.');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: AppPath.MyTasks,
    });
    if (result?.error) {
      toast.error('Invalid credentials.');
    } else {
      toast.success('Logged in successfully! Loading your tasks...');
      resetSignIn();
      router.push(AppPath.MyTasks);
    }
  }

  async function resendVerificationEmail(email: string) {
    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error('Failed to resend verification email.');
      }
      toast.success('Verification email sent.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    }
  }

  return {
    registerRegister,
    handleSubmitRegister,
    onSubmitRegister,
    isRecaptchaError,
    registerErrors,
    isRegisterSubmitting,
    registerSignIn,
    handleSubmitSignIn,
    onSubmitSignIn,
    errorsSignIn,
    isSignInSubmitting,
    verifiedEmail,
    watchSignIn,
    resendVerificationEmail,
  };
}
