import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

export default function LoginWithGoogle() {
  return (
    <Button
      type="button"
      onClick={() => signIn('google', { callbackUrl: '/my-tasks', redirect: true })}
      variant="secondary"
      className="w-full cursor-pointer"
    >
      <FaGoogle className="mr-2" />
      Log in with Google
    </Button>
  );
}
