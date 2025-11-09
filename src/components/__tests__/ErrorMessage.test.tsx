import { render, screen } from '@testing-library/react';
import ErrorMessage from '../status/ErrorMessage';

describe('ErrorMessage component', () => {
  it('Displays correct title and description if provided', () => {
    render(<ErrorMessage title="This is error" description="Try again later" />);
    const title = screen.getByText(/this is error/i);
    const description = screen.getByText(/try again later/i);
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('Displays default title and description if not provided', () => {
    render(<ErrorMessage />);
    const title = screen.getByText(/Something went wrong/i);
    const description = screen.getByText(/An unexpected error occurred. Please try again later./i);
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('Displays Retry button if onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: /retry/i });
    expect(button).toBeInTheDocument();
  });
});
