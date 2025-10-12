import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginWithGithub() {
  const router = useRouter();

  async function handleGithubLogin() {
    const result = await signIn('github', { redirect: false, callbackUrl: '/my-tasks' });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Logged in successfully!');
      router.push(result?.url || '/my-tasks');
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGithubLogin}
      variant="secondary"
      className="w-full cursor-pointer"
    >
      <FaGithub className="mr-2" />
      Log in with Github
    </Button>
  );
}
