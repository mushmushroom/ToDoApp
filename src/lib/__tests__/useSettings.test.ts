import { act, renderHook, waitFor } from '@testing-library/react';
import useSettings from '../hooks/useSettings';
import { API_URL } from '@/lib/constants';
import { toast } from 'sonner';

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe('useSettings hook', () => {
  it('Calls /api/change-password and shows toast on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useSettings());
    await act(async () => {
      await result.current.changePassword({
        oldPassword: 'password1',
        newPassword: 'password2',
        confirmPassword: 'password2',
      });
    });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/change-password`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    expect(toast.success).toHaveBeenCalledWith('The password was updated successfully');
  });
  it('Shows error if the password was not updated', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error' }),
    });

    const { result } = renderHook(() => useSettings());
    await act(async () => {
      await result.current.changePassword({
        oldPassword: 'password1',
        newPassword: 'password2',
        confirmPassword: 'password2',
      });
    });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/change-password`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    expect(toast.error).toHaveBeenCalledWith('Error');
  });

  it('Shows generic error toast when network fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSettings());

    await act(async () => {
      await result.current.changePassword({
        oldPassword: 'password1',
        newPassword: 'password2',
        confirmPassword: 'password2',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Something went wrong. Try again later.');
  });
});
