import { render, screen } from '@testing-library/react';
import ChangePasswordForm from '../settings/ChangePasswordForm';
import useSettings from '@/lib/hooks/useSettings';

jest.mock('@/lib/hooks/useSettings');

jest.mock('../custom/FormField.tsx', () => {
  const MockFormField = (props: { type: string }) => (
    <input type={props.type} data-testid="form-field" />
  );
  MockFormField.displayName = 'MockFormField';
  return MockFormField;
});

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    (useSettings as jest.Mock).mockReturnValue({
      registerChangePass: jest.fn(),
      handleSubmitChangePass: jest.fn((fn) => fn),
      changePassword: jest.fn(),
      errorsChangePass: {},
      isChangePassSubmitting: false,
    });
  });

  it('renders change password form with all fields and a button', () => {
    render(<ChangePasswordForm />);
    const inputs = screen.getAllByTestId('form-field');
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveAttribute('type', 'password');
    expect(inputs[1]).toHaveAttribute('type', 'password');
    expect(inputs[2]).toHaveAttribute('type', 'password');
    const button = screen.getByRole('button', { name: /change password/i });
    expect(button).toBeInTheDocument();
  });

  it('disables button and displayes the correct text if form is submitting', () => {
    (useSettings as jest.Mock).mockReturnValue({
      registerChangePass: jest.fn(),
      handleSubmitChangePass: jest.fn((fn) => fn),
      changePassword: jest.fn(),
      errorsChangePass: {},
      isChangePassSubmitting: true,
    });
    render(<ChangePasswordForm />);
    const button = screen.getByRole('button', { name: /processing/i });
    expect(button).toBeDisabled();
  });
});
