import FormField from '@/components/custom/FormField';
import useAuth from '@/hooks/useAuth';
import { Button } from '../ui/button';

export default function RegisterForm() {
  const {
    registerRegister,
    handleSubmitRegister,
    onSubmitRegister,
    isRecaptchaError,
    registerErrors,
    isRegisterSubmitting,
  } = useAuth();

  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmitRegister(onSubmitRegister)}>
      <FormField
        placeholder="johndoe@gmail.com"
        id="email"
        type="email"
        label="Email"
        registration={registerRegister('email', { required: true })}
        errors={registerErrors.email}
      />
      <FormField
        placeholder="Input your password"
        id="password"
        type="password"
        label="Your password"
        registration={registerRegister('password', { required: true })}
        errors={registerErrors.password}
        isPasswordField
      />
      <FormField
        placeholder="Confirm your password"
        id="confirmPassword"
        type="password"
        label="Confirm your password"
        registration={registerRegister('confirmPassword', { required: true })}
        errors={registerErrors.confirmPassword}
        isPasswordField
      />

      <Button className="cursor-pointer" disabled={isRegisterSubmitting}>
        {isRegisterSubmitting ? 'Processing...' : 'Register'}
      </Button>
      {isRecaptchaError && <p className="text-red-500">Unable to load CAPTCHA. Try reloading.</p>}
    </form>
  );
}
