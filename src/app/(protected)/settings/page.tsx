'use client';
import { useSession } from 'next-auth/react';

export default function AccountPage() {
  const { data: session } = useSession();
  return (
    <div>
      <div>Name: {session?.user?.name}</div>
      <div>Email: {session?.user?.email}</div>
    </div>
  );
}
