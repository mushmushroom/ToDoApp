'use client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(8, 'Password should contain at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type ChangePasswordInputs = z.infer<typeof changePasswordSchema>;

export default function useSettings() {
  const router = useRouter();

  const {
    register: registerChangePass,
    handleSubmit: handleSubmitChangePass,
    reset: resetChangePass,
    formState: { errors: errorsChangePass, isSubmitting: isChangePassSubmitting },
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  async function changePassword({ oldPassword, newPassword }: ChangePasswordInputs) {
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Failed to update the password');
        return;
      }
      resetChangePass();
      toast('The password was updated successfully');
    } catch (error) {
      console.log((error as Error).message);
      toast.error('Something went wrong. Try again later.');
    }
  }

  return {
    registerChangePass,
    handleSubmitChangePass,
    errorsChangePass,
    isChangePassSubmitting,
    changePassword,
  };
}
