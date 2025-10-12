import { toast } from 'sonner';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  function handleLogout() {
    signOut({ redirectTo: '/' });
    toast('You have been successfully logged out.');
  }
  return <Button onClick={handleLogout} className="cursor-pointer">Logout</Button>;
}
