import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginWithGoogle from '../auth/LoginWithGoogle';
import { signIn } from 'next-auth/react';
import { AppPath } from '@/lib/links';
import { toast } from 'sonner';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signIn: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('LoginWithGoogle Component', () => {
  it('renders correct button text', () => {
    render(<LoginWithGoogle />);
    const button = screen.getByRole('button', { name: /log in with google/i });
    expect(button).toBeInTheDocument();
  });

  it("calls signIn with 'google' provider on button click and shows a toast", async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    render(<LoginWithGoogle />);
    const button = screen.getByRole('button', { name: /log in with google/i });
    fireEvent.click(button);
    expect(signIn).toHaveBeenCalledWith('google', {
      redirect: false,
      callbackUrl: AppPath.MyTasks,
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
    });
  });
});
