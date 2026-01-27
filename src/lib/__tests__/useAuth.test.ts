import { act, renderHook, waitFor } from '@testing-library/react';
import useAuth from '../hooks/useAuth';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { API_URL } from '@/lib/constants';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn();

function mockFetchOnce(data) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValue(data),
  });
}

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
    it('Calls /register and redirects on success', async () => {
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
          }),
        );
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Success! Please check your inbox for a verification email.',
      );
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
    beforeEach(() => {
      jest.clearAllMocks();
      global.fetch = jest.fn();
    });

    it('shows error when email is not verified', async () => {
      mockFetchOnce({ exists: true, verified: false });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.onSubmitSignIn({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      expect(toast.error).toHaveBeenCalledWith('Please verify your email before signing in.');
      expect(signIn).not.toHaveBeenCalled();
    });

    it('shows error for invalid credentials', async () => {
      mockFetchOnce({ exists: true, verified: true });
      (signIn as jest.Mock).mockResolvedValueOnce({ error: 'CredentialsSignin' });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.onSubmitSignIn({
          email: 'test@test.com',
          password: 'wrongpass',
        });
      });

      expect(toast.error).toHaveBeenCalledWith('Invalid credentials.');
    });
  });
});
