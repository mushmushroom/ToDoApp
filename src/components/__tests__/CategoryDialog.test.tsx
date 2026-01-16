import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryDialog from '../categories/CategoryDialog';

describe('CategoryDialog Component', () => {
  const onSubmit = jest.fn(() => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  });

  it('renders the correct button text based on mode', () => {
    // Test for 'add' mode
    render(<CategoryDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new category/i });
    expect(addButton).toBeInTheDocument();

    // Test for 'edit' mode
    render(<CategoryDialog mode="edit" onSubmit={onSubmit} defaultTitle="Work" />);
    const editButton = screen.getByTitle(/edit a category/i);
    expect(editButton).toBeInTheDocument();
  });

  it('show defaultTitle if passed in edit mode', () => {
    render(<CategoryDialog mode="edit" onSubmit={onSubmit} defaultTitle="Work" />);
    const editButton = screen.getByTitle(/edit a category/i);
    fireEvent.click(editButton);

    const input = screen.getByPlaceholderText(/e.g. Work, Personal, Shopping.../i);
    expect(input).toHaveValue('Work');
  });

  it('Close/add button opens and closes the dialog', () => {
    render(<CategoryDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new category/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. Work, Personal, Shopping.../i);
    fireEvent.change(input, { target: { value: 'New category' } });
    fireEvent.click(addButton);
    expect(input).not.toBeInTheDocument();
  });

  it('Close button closes the dialog', () => {
    render(<CategoryDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new category/i });
    fireEvent.click(addButton);
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(closeButton);
    const input = screen.queryByPlaceholderText(/e.g. Work, Personal, Shopping.../i);
    expect(input).not.toBeInTheDocument();
  });

  it('Show validation error if input is too short', async () => {
    render(<CategoryDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new category/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. Work, Personal, Shopping.../i);
    fireEvent.change(input, { target: { value: 'New' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
    expect(
      screen.getByText(/The category name should contain at least 4 characters/i)
    ).toBeInTheDocument();
  });

  it('Correct text is displayed on the submit button when form is being submitted', async () => {
    render(<CategoryDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new category/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. Work, Personal, Shopping.../i);
    fireEvent.change(input, { target: { value: 'New category' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('Calls onSubmit when the form is submitted', async () => {
    render(<CategoryDialog mode="add" onSubmit={onSubmit} />);
    const addButton = screen.getByRole('button', { name: /add new category/i });
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText(/e.g. Work, Personal, Shopping.../i);
    fireEvent.change(input, { target: { value: 'New category' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(onSubmit).toHaveBeenCalledWith('New category');
  });
});
