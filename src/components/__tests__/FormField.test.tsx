import { fireEvent, render, screen } from '@testing-library/react';
import FormField from '../custom/FormField';
import { useForm } from 'react-hook-form';
import { CHAR_LIMIT } from '@/lib/constants';

function WrapperTextField() {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  return (
    <FormField
      id="name"
      label="Name"
      placeholder="Enter name"
      type="text"
      registration={register('name')}
      errors={{ message: 'Name is required', type: 'required' }}
    />
  );
}

function WrapperFieldHiddenLabel() {
  const { register } = useForm({
    defaultValues: {
      name: '',
    },
  });

  return (
    <FormField
      id="name"
      label="Name"
      placeholder="Enter name"
      type="text"
      registration={register('name')}
      hasLabelHidden
    />
  );
}

function WrapperPasswordField() {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
    },
  });

  return (
    <FormField
      id="password"
      label="password"
      placeholder="Enter password"
      type="password"
      registration={register('password')}
      errors={{ message: 'Password is required', type: 'required' }}
      isPasswordField
    />
  );
}

function WatchWrapper() {
  const { register, watch } = useForm({ defaultValues: { task: 'Test' } });
  return (
    <FormField
      id="task"
      label="Task"
      placeholder="Enter your task"
      type="text"
      registration={register('task')}
      watch={watch}
    />
  );
}

describe('FormField Component', () => {
  it('renders label with correct text', () => {
    const { container } = render(<WrapperTextField />);
    const label = container.querySelector('label');
    expect(label).toHaveTextContent('Name');
  });

  it('renders input with correct id, type and placeholder', () => {
    render(<WrapperTextField />);
    const input = screen.getByPlaceholderText(/enter name/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders error message when errors prop is passed', () => {
    render(<WrapperTextField />);
    const errorMessage = screen.getByText(/name is required/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders password field if isPasswordField is true', () => {
    render(<WrapperPasswordField />);
    const input = screen.getByPlaceholderText(/enter password/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows and hides password when toggle button is clicked', () => {
    render(<WrapperPasswordField />);
    const input = screen.getByPlaceholderText(/enter password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('does not show label if hasLabelHidden is true', () => {
    render(<WrapperFieldHiddenLabel />);
    const label = screen.getByText(/name/i);
    expect(label).toHaveClass('sr-only');
  });

  it('shows character count when watch prop is provided and type is text', () => {
    render(<WatchWrapper />);
    const charCount = screen.getByText(`4 / ${CHAR_LIMIT}`);
    expect(charCount).toBeInTheDocument();
  });
});
