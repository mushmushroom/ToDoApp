'use client';
import FormField from '../custom/FormField';
import { Button } from '../ui/button';

import useAuth from '@/lib/hooks/useAuth';

export default function LoginForm() {
  const { registerSignIn, handleSubmitSignIn, onSubmitSignIn, errorsSignIn, isSignInSubmitting } =
    useAuth();
  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmitSignIn(onSubmitSignIn)}>
      <FormField
        placeholder="johndoe@gmail.com"
        id="email"
        type="email"
        label="Email"
        errors={errorsSignIn.email}
        registration={registerSignIn('email', { required: true })}
      />
      <FormField
        placeholder="Enter your password"
        id="password"
        type="password"
        label="Password"
        errors={errorsSignIn.password}
        registration={registerSignIn('password', { required: true })}
        isPasswordField
      />
      <Button className="cursor-pointer" disabled={isSignInSubmitting}>
        {isSignInSubmitting ? 'Processing...' : 'Log in'}
      </Button>
    </form>
  );
}
