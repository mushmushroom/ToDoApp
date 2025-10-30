'use client';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';
import LinkedAccounts from '@/components/settings/LinkedAccounts';
import ErrorMessage from '@/components/status/ErrorMessage';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import useProvider from '@/lib/hooks/useProvider';
import { useSession } from 'next-auth/react';
import { FaSpinner } from 'react-icons/fa';

export default function AccountPage() {
  const { data: session } = useSession();
  const { data, isLoading, isError, refetch } = useProvider();

  if (isLoading)
    return (
      <div className="flex justify-center items-center gap-2 p-3">
        <Spinner />
        Loading account data...
      </div>
    );

  if (isError) { 
    return (
      <ErrorMessage title="Error loading account data" onRetry={refetch}/>
    )
  }
  return (
    <div>
      <div className="py-8">
        <h2 className="mb-4 font-bold text-3xl text-primary">Account information</h2>
        {session?.user?.name && <div>Name: {session?.user?.name}</div>}
        <div>Email: {session?.user?.email}</div>
      </div>
      <Separator />
      <div className="py-8">
        {data.isOAuth ? <LinkedAccounts providers={data.providers} /> : <ChangePasswordForm />}
      </div>
    </div>
  );
}
