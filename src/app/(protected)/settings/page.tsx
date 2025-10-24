'use client';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import LinkedAccounts from '@/components/LinkedAccounts';
import { Separator } from '@/components/ui/separator';
import useProvider from '@/lib/hooks/useProvider';
import { useSession } from 'next-auth/react';

export default function AccountPage() {
  const { data: session } = useSession();
  const { data, isLoading } = useProvider();
  // console.log(data);

  if (isLoading) return <p>loading the data</p>;
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
