import { fireEvent, render, screen } from '@testing-library/react';
import DeleteDialog from '../common/DeleteDialog';

describe('DeleteDialog Component', () => {
  const onConfirm = jest.fn();

  it('Correct text is displayed based on the type', () => {
    render(<DeleteDialog title="Sample Category" onConfirm={onConfirm} type="category" />);
    const button = screen.getByTitle('Delete a category');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    const title = screen.getByRole('heading', { name: /delete the category/i });
    expect(title).toBeInTheDocument();
  });
  it('If type is category, input is displayed', () => {
    render(<DeleteDialog title="Sample Category" onConfirm={onConfirm} type="category" />);
    const button = screen.getByTitle('Delete a category');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    const label = screen.getByLabelText(/Delete all tasks in this category/i);
    expect(label).toBeInTheDocument();
  });
  it('renders the delete button', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} type="task" />);
    const button = screen.getByTitle(/delete a task/i);
    expect(button).toBeInTheDocument();
  });
  it('task title is displayed in the dialog', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} type="task" />);
    const button = screen.getByTitle(/delete a task/i);
    fireEvent.click(button);
    const taskTitle = screen.getByText(/sample task/i);
    expect(taskTitle).toBeInTheDocument();
  });

  it('calls onConfirm when delete is confirmed', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} type="task" />);
    const deleteButton = screen.getByTitle(/delete a task/i);
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalled();
  });
  it('closes the dialog when cancel is clicked', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} type="task" />);
    const deleteButton = screen.getByTitle(/delete a task/i);
    fireEvent.click(deleteButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    const taskTitle = screen.queryByText(/sample task/i);
    expect(taskTitle).not.toBeInTheDocument();
  });
});
