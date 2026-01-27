import { renderHook, act, waitFor } from '@testing-library/react';
import { useVerifyEmail } from '@/lib/hooks/useVerifyEmail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'ReactQueryTestWrapper';

  return Wrapper;
}
global.fetch = jest.fn();

describe('useVerifyEmail', () => {
  it('successfully verifies email', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync('valid-token');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetch).toHaveBeenCalledWith('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'valid-token' }),
    });

    expect(result.current.data).toEqual({ success: true });
  });

  it('throws error when token is invalid or expired', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Token is invalid or expired' }),
    });

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync('bad-token')).rejects.toThrow(
        'Token is invalid or expired',
      );
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('throws generic error if API does not return message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync('bad-token')).rejects.toThrow('Verification failed');
    });
  });
});
