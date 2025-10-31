import { toast } from 'sonner';
import { Button } from '..//ui/button';
import { signOut } from 'next-auth/react';
import { AppPath } from '@/lib/links';

export default function LogoutButton() {
  function handleLogout() {
    signOut({ redirectTo: AppPath.Home });
    toast('You have been successfully logged out.');
  }
  return (
    <Button onClick={handleLogout} variant="secondary" className="cursor-pointer text-xl">
      Logout
    </Button>
  );
}
