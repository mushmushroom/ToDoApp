import { render, screen } from '@testing-library/react';
import LoginForm from '../auth/LoginForm';
import useAuth from '@/lib/hooks/useAuth';

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signIn: jest.fn(),
  useSession: jest.fn(() => ({
    status: 'unauthenticated',
  })),
}));

jest.mock('../custom/FormField.tsx', () => (props: { type: string }) => (
  <input type={props.type} data-testid="form-field" />
));

jest.mock('@/lib/hooks/useAuth');

describe('LoginForm Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      registerSignIn: jest.fn(),
      handleSubmitSignIn: jest.fn((fn) => fn),
      onSubmitSignIn: jest.fn(),
      errorsSignIn: {},
      isSignInSubmitting: false,
    });
  });
  it('renders login form with email and password fields and submit button', () => {
    render(<LoginForm />);
    const inputs = screen.getAllByTestId('form-field');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute('type', 'email');
    expect(inputs[1]).toHaveAttribute('type', 'password');
    const button = screen.getByRole('button', { name: /log in/i });
    expect(button).toBeInTheDocument();
  });
  it('disables button and displayes the correct text if form is submitting', () => {
    (useAuth as jest.Mock).mockReturnValue({
      registerSignIn: jest.fn(),
      handleSubmitSignIn: jest.fn((fn) => fn),
      onSubmitSignIn: jest.fn(),
      errorsSignIn: {},
      isSignInSubmitting: true,
    });
    render(<LoginForm />);
    const button = screen.getByRole('button', { name: /processing/i });
    expect(button).toBeDisabled();
  });
});
