import { render, screen } from '@testing-library/react';
import Header from '../header/Header';
import { headerLinks } from '@/lib/links';

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    status: 'unauthenticated',
  })),
}));

describe('Header Component', () => {
  it('renders logo', () => {
    render(<Header />);
    const logo = screen.getAllByAltText(/logo/i);
    expect(logo.length).toBeGreaterThan(0);
  });

  it('render header links', () => {
    render(<Header />);
    headerLinks.rightLinks.forEach((link) => {
      expect(screen.getByText(link.text)).toBeInTheDocument();
    });
    headerLinks.leftLinks.forEach((link) => {
      expect(screen.getByText(link.text)).toBeInTheDocument();
    });
  });

  it('render logout button', () => {
    render(<Header />);
    expect(screen.getAllByText(/logout/i).length).toBeGreaterThan(0);
  });
});
