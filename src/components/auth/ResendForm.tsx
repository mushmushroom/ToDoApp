'use client';
import FormField from '../common/FormField';
import * as z from 'zod';

import useAuth from '@/lib/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';


const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResendInputs = z.infer<typeof resendSchema>;

export default function ResendForm() {
  const { resendVerificationEmail } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResendInputs>({ resolver: zodResolver(resendSchema), mode: 'onChange' });

  async function onSubmit(data: ResendInputs) {
    await resendVerificationEmail(data.email);
    reset();
  }
  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        placeholder="johndoe@gmail.com"
        id="email"
        type="email"
        label="Enter your email"
        errors={errors.email}
        registration={register('email', { required: true })}
      />
      <Button className="cursor-pointer" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Processing...' : 'Resend verification email'}
      </Button>
      
    </form>
  );
}
