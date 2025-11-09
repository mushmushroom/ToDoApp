import { render, screen } from '@testing-library/react';
import LinkedAccounts from '../settings/LinkedAccounts';

describe('LinkedAccounts component', () => {
  it('Displays all provided providers', () => {
    render(<LinkedAccounts providers={['google', 'github']} />);
    const googleProvider = screen.getByText(/google/i);
    const githubProvider = screen.getByText(/github/i);
    const connectedMessages = screen.getAllByText(/connected/i);
    expect(googleProvider).toBeInTheDocument();
    expect(githubProvider).toBeInTheDocument();
    expect(connectedMessages).toHaveLength(2);
  });
  it('Does not display provider, if it is not available', () => {
    render(<LinkedAccounts providers={['test']} />);
    expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
  });
});
