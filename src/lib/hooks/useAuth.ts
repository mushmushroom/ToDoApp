'use client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReCaptcha } from 'react-enterprise-recaptcha';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
  const router = useRouter();
  // create user
  async function createUser(
    email: string,
    password: string,
    captchaToken: string,
    onSuccess?: () => void
  ) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Failed to register');
        return;
      }
      toast('Success! You will be redirected to the login page now.');
      if (onSuccess) {
        onSuccess();
        router.push('/auth/sign-in');
      }
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
    formState: { errors: errorsSignIn, isSubmitting: isSignInSubmitting },
  } = useForm<SignInInputs>({ resolver: zodResolver(signInSchema), mode: 'onChange' });

  // sign in function
  async function onSubmitSignIn({ email, password }: SignInInputs) {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/my-tasks',
    });
    if (result?.error) {
      toast.error('Invalid credentials');
    } else {
      toast.success('Logged in successfully! Loading your tasks...');
      resetSignIn();
      router.push('/my-tasks');
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
  };
}
