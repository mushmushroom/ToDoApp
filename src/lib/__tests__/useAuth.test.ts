import { act, renderHook, waitFor } from '@testing-library/react';
import useAuth from '../hooks/useAuth';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { API_URL } from '@/lib/constants';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

jest.mock('react-enterprise-recaptcha', () => ({
  useReCaptcha: () => ({
    executeRecaptcha: jest.fn(() => Promise.resolve('mock-token')),
    isError: false,
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe('useAuth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Registration flow', () => {
    it('Calls /api/register and redirects on success', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.onSubmitRegister({
          email: 'test@test.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          `${API_URL}/register`,
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Success! You will be redirected to the login page now.'
      );
      expect(mockPush).toHaveBeenCalledWith('/auth/sign-in');
    });

    it('Shows toast in case of an error during registration', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Error' }),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.onSubmitRegister({
          email: 'test@test.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });

      expect(toast.error).toHaveBeenCalledWith('Error');
    });
  });

  describe('Sign-in flow', () => {
    it('Shows error for invalid credentials', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.onSubmitSignIn({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
    it('Shows toast on successful login and redirects', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.onSubmitSignIn({
          email: 'test@test.com',
          password: 'password123',
        });
      });
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully! Loading your tasks...');
      expect(mockPush).toHaveBeenCalledWith('/my-tasks');
    });
  });
});
