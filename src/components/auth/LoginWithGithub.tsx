import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';

export default function LoginWithGithub() {

  function onSignInWithGithub() {
    signIn('github', { callbackUrl: '/my-tasks', redirect: true });
    
  }
  return (
    <Button
      type="button"
      onClick={() => signIn('github', { callbackUrl: '/my-tasks', redirect: true })}
      variant="secondary"
      className="w-full cursor-pointer"
    >
      <FaGithub className="mr-2" />
      Log in with Github
    </Button>
  );
}
