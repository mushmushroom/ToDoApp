import useGetCategories from '@/lib/hooks/useCategories';
import TaskDialog from '../tasks/TaskDialog';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/lib/hooks/useCategories', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockCategories = [
  { id: '1', name: 'Work' },
  { id: '2', name: 'Personal' },
];

describe('TaskDialog Component', () => {
  beforeEach(() => {
    (useGetCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
    });
  });
  const onSubmit = jest.fn(() => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  });

  it('renders the correct button text based on mode', () => {
    // Test for 'add' mode
    render(<TaskDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new task/i });
    expect(addButton).toBeInTheDocument();

    // Test for 'edit' mode
    render(<TaskDialog mode="edit" onSubmit={onSubmit} defaultTitle="Get groceries" />);
    const editButton = screen.getByTitle(/edit a task/i);
    expect(editButton).toBeInTheDocument();
  });

  it('categories are displayed in select', () => {
    render(<TaskDialog mode="edit" onSubmit={onSubmit} defaultTitle="Get groceries" />);
    const editButton = screen.getByTitle(/edit a task/i);
    fireEvent.click(editButton);
    const categorySelect = screen.getByRole('combobox');
    expect(categorySelect).toBeInTheDocument();

    fireEvent.click(categorySelect);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3); 
    expect(options[0]).toHaveTextContent('No category');
    expect(options[1]).toHaveTextContent('Work');
    expect(options[2]).toHaveTextContent('Personal');
  });

  it('show defaultTitle if passed in edit mode', () => {
    render(<TaskDialog mode="edit" onSubmit={onSubmit} defaultTitle="Get groceries" />);
    const editButton = screen.getByTitle(/edit a task/i);
    fireEvent.click(editButton);

    const input = screen.getByPlaceholderText(/e.g. Get groceries/i);
    expect(input).toHaveValue('Get groceries');
  });

  it('Close/add button opens and closes the dialog', () => {
    render(<TaskDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new task/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. get groceries/i);
    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.click(addButton);
    expect(input).not.toBeInTheDocument();
  });

  it('Close button closes the dialog', () => {
    render(<TaskDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new task/i });
    fireEvent.click(addButton);
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(closeButton);
    const input = screen.queryByPlaceholderText(/e.g. get groceries/i);
    expect(input).not.toBeInTheDocument();
  });

  it('Show validation error if input is too short', async () => {
    render(<TaskDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new task/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. get groceries/i);
    fireEvent.change(input, { target: { value: 'New' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
    expect(screen.getByText(/The task should contain at least 5 characters/i)).toBeInTheDocument();
  });

  it('Correct text is displayed on the submit button when form is being submitted', async () => {
    render(<TaskDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new task/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. get groceries/i);
    fireEvent.change(input, { target: { value: 'New task' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('Calls onSubmit when the form is submitted', async () => {
    render(<TaskDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new task/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. get groceries/i);
    fireEvent.change(input, { target: { value: 'New task' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(onSubmit).toHaveBeenCalledWith('New task', null);
  });
});
