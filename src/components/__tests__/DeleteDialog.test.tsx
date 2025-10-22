import { fireEvent, render, screen } from '@testing-library/react';
import { Delete } from 'lucide-react';
import DeleteDialog from '../DeleteDialog';

describe('DeleteDialog Component', () => {
  const onConfirm = jest.fn();

  it('renders the delete button', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} />);
    const button = screen.getByTitle(/delete a task/i);
    expect(button).toBeInTheDocument();
  });
  it('task title is displayed in the dialog', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} />);
    const button = screen.getByTitle(/delete a task/i);
    fireEvent.click(button);
    const taskTitle = screen.getByText(/sample task/i);
    expect(taskTitle).toBeInTheDocument();
  });

  it('calls onConfirm when delete is confirmed', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} />);
    const deleteButton = screen.getByTitle(/delete a task/i);
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalled();
  });
  it('closes the dialog when cancel is clicked', () => {
    render(<DeleteDialog title="Sample Task" onConfirm={onConfirm} />);
    const deleteButton = screen.getByTitle(/delete a task/i);
    fireEvent.click(deleteButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    const taskTitle = screen.queryByText(/sample task/i);
    expect(taskTitle).not.toBeInTheDocument();
  });
});
