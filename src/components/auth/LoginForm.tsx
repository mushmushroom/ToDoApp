'use client';
import FormField from '../common/FormField';
import { Button } from '../ui/button';

import useAuth from '@/lib/hooks/useAuth';

export default function LoginForm() {
  const {
    registerSignIn,
    handleSubmitSignIn,
    onSubmitSignIn,
    errorsSignIn,
    isSignInSubmitting,
    verifiedEmail,
    watchSignIn,
    resendVerificationEmail,
  } = useAuth();
  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmitSignIn(onSubmitSignIn)}>
      <FormField
        placeholder="johndoe@gmail.com"
        id="email"
        type="email"
        label="Email"
        errors={errorsSignIn.email}
        registration={registerSignIn('email', { required: true })}
        watch={watchSignIn}
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
      <Button className="cursor-pointer" disabled={isSignInSubmitting} type="submit">
        {isSignInSubmitting ? 'Processing...' : 'Log in'}
      </Button>
      {!verifiedEmail && (
        <Button variant="outline" type="button" onClick={() => resendVerificationEmail(watchSignIn('email'))}>
          Resend verification email
        </Button>
      )}
    </form>
  );
}
