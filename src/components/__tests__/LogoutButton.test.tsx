import { fireEvent, render, screen } from '@testing-library/react';
import LogoutButton from '../LogoutButton';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: { user: { name: 'Demo User' } },
    status: 'authenticated',
  })),
}));

jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

describe('LogoutButton Component', () => {
  it('Button text is rendered', () => {
    render(<LogoutButton />);
    const buttonText = screen.getByText(/logout/i);
    expect(buttonText).toBeInTheDocument();
  });
  it('handleLogout function is run on click', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    expect(signOut).toHaveBeenCalledWith({ redirectTo: '/' });
    expect(toast).toHaveBeenCalledWith('You have been successfully logged out.');
  });
});
