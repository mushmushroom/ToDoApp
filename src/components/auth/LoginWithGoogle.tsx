import { AppPath } from '@/lib/links';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';

export default function LoginWithGoogle() {
  const router = useRouter();

  async function handleGoogleLogin() {
    const result = await signIn('google', { redirect: false, callbackUrl: AppPath.MyTasks });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Logged in successfully!');
      router.push(result?.url || AppPath.MyTasks);
    }
  }
  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      variant="secondary"
      className="w-full cursor-pointer"
    >
      <FaGoogle className="mr-2" />
      Log in with Google
    </Button>
  );
}
