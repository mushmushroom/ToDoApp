import useGetCategories from '@/lib/hooks/useCategories';
import { render, screen } from '@testing-library/react';
import CategoriesSection from '../categories/CategoriesSection';

jest.mock('@/lib/hooks/useCategories', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockCategories = [
  { id: '1', name: 'Work' },
  { id: '2', name: 'Personal' },
];

jest.mock('../categories/CategoriesSelect.tsx', () => {
  const MockCategoriesSelect = () => <div data-testid="categories-select">CategoriesSelect</div>;
  MockCategoriesSelect.displayName = 'MockCategoriesSelect';
  return MockCategoriesSelect;
});

describe('CategoriesSection Component', () => {
  beforeEach(() => {
    (useGetCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
    });
  });

  const onChange = jest.fn(() => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  });

  it('if NOT demo page, button is available', () => {
    render(<CategoriesSection value="test" onChange={onChange} isDemo={false} />);
    const button = screen.getByRole('link', { name: /Manage categories/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('if demo page, button is disabled', () => {
    render(<CategoriesSection value="test" onChange={onChange} isDemo={true} />);
    const button = screen.getByRole('button', { name: /Manage categories/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('categoriesSelect is rendered', () => {
    render(<CategoriesSection value="test" onChange={onChange} isDemo={false} />);
    const categoriesSelect = screen.getByTestId('categories-select');
    expect(categoriesSelect).toBeInTheDocument();
  });
});
