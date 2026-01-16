import { fireEvent, render, screen } from '@testing-library/react';
import { Category } from '@/lib/types/types';
import { useDeleteCategory, useUpdateCategory } from '@/lib/hooks/useCategories';
import CategoryItem from '../categories/CategoryItem';

const testCategory: Category = {
  id: '1',
  name: 'Work',
};

jest.mock('@/lib/hooks/useCategories', () => ({
  useUpdateCategory: jest.fn(),
  useDeleteCategory: jest.fn(),
}));

jest.mock('../categories/CategoryDialog.tsx', () => {
  return {
    __esModule: true,
    default: ({ onSubmit }: { onSubmit: (name: string) => void }) => (
      <button data-testid="category-dialog" onClick={() => onSubmit('Updated Category')}>
        CategoryDialog
      </button>
    ),
  };
});

jest.mock('../common/DeleteDialog.tsx', () => {
  const MockDeleteDialog = ({
    onConfirm,
  }: {
    onConfirm: (args: { deleteTasks: boolean }) => void;
  }) => (
    <button data-testid="delete-dialog" onClick={() => onConfirm({ deleteTasks: true })}>
      DeleteDialog
    </button>
  );
  MockDeleteDialog.displayName = 'MockDeleteDialog';
  return MockDeleteDialog;
});

describe('CategoryItem Component', () => {
  const mockUpdate = { mutate: jest.fn() };
  const mockDelete = { mutate: jest.fn() };

  beforeEach(() => {
    (useUpdateCategory as jest.Mock).mockReturnValue(mockUpdate);
    (useDeleteCategory as jest.Mock).mockReturnValue(mockDelete);
    mockUpdate.mutate.mockClear();
    mockDelete.mutate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders category item with correct name', () => {
    render(<CategoryItem category={testCategory} />);
    const titleText = screen.getByText(/work/i);
    expect(titleText).toBeInTheDocument();
  });

  it('renders TaskDialog and DeleteDialog components', () => {
    render(<CategoryItem category={testCategory} />);
    const taskDialog = screen.getByTestId('category-dialog');
    const deleteDialog = screen.getByTestId('delete-dialog');
    expect(taskDialog).toBeInTheDocument();
    expect(deleteDialog).toBeInTheDocument();
  });

  it('calls updateCategory when update is confirmed', () => {
    render(<CategoryItem category={testCategory} />);
    const categoryDialog = screen.getByTestId('category-dialog');
    fireEvent.click(categoryDialog);
    expect(mockUpdate.mutate).toHaveBeenCalledWith({
      id: '1',
      data: { name: 'Updated Category' },
    });
  });

  it('calls deleteCategory.mutate when delete is confirmed', () => {
    render(<CategoryItem category={testCategory} />);
    const deleteDialog = screen.getByTestId('delete-dialog');
    fireEvent.click(deleteDialog);
    expect(mockDelete.mutate).toHaveBeenCalledWith({
      id: '1',
      deleteTasks: true,
    });
  });
});
