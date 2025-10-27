import useAuth from '@/lib/hooks/useAuth';
import { render, screen } from '@testing-library/react';
import RegisterForm from '../auth/RegisterForm';

jest.mock('../custom/FormField.tsx', () => (props: { type: string }) => (
  <input type={props.type} data-testid="form-field" />
));

jest.mock('@/lib/hooks/useAuth');

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signIn: jest.fn(),
  useSession: jest.fn(() => ({
    status: 'unauthenticated',
  })),
}));

describe('RegisterForm Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      registerRegister: jest.fn(),
      handleSubmitRegister: jest.fn((fn) => fn),
      onSubmitRegister: jest.fn(),
      isRecaptchaError: false,
      registerErrors: {},
      isRegisterSubmitting: false,
    });
  });

  it('renders register form with email and password fields and submit button', () => {
    render(<RegisterForm />);
    const inputs = screen.getAllByTestId('form-field');
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveAttribute('type', 'email');
    expect(inputs[1]).toHaveAttribute('type', 'password');
    expect(inputs[2]).toHaveAttribute('type', 'password');
    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeInTheDocument();
  });

  it('disables button and displayes the correct text if form is submitting', () => {
    (useAuth as jest.Mock).mockReturnValue({
      registerRegister: jest.fn(),
      handleSubmitRegister: jest.fn((fn) => fn),
      onSubmitRegister: jest.fn(),
      isRecaptchaError: false,
      registerErrors: {},
      isRegisterSubmitting: true,
    });
    render(<RegisterForm />);
    const button = screen.getByRole('button', { name: /processing/i });
    expect(button).toBeDisabled();
  });

  it('shows recaptcha error message when isRecaptchaError is set', () => {
    const recaptchaErrorMessage = 'Unable to load CAPTCHA. Try reloading.';
    (useAuth as jest.Mock).mockReturnValue({
      registerRegister: jest.fn(),
      handleSubmitRegister: jest.fn((fn) => fn),
      onSubmitRegister: jest.fn(),
      isRecaptchaError: true,
      registerErrors: {},
      isRegisterSubmitting: false,
    });
    render(<RegisterForm />);
    const errorMessage = screen.getByText(recaptchaErrorMessage);
    expect(errorMessage).toBeInTheDocument();
  });
});
