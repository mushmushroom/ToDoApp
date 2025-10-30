import { fireEvent, render, screen } from '@testing-library/react';
import TaskItem from '../tasks/TaskItem';
import { useDeleteTask, useUpdateTask } from '@/lib/hooks/useTasks';

jest.mock('@/lib/hooks/useTasks', () => ({
  useUpdateTask: jest.fn(),
  useDeleteTask: jest.fn(),
}));

jest.mock('../tasks/TaskDialog.tsx', () => {
  const MockTaskDialog = () => <div data-testid="task-dialog">TaskDialog</div>;
  MockTaskDialog.displayName = 'MockTaskDialog';
  return MockTaskDialog;
});

jest.mock('../tasks/DeleteDialog.tsx', () => {
  const MockDeleteDialog = (props: { onConfirm: () => void }) => (
    <button data-testid="delete-dialog" onClick={() => props.onConfirm()}>
      DeleteDialog
    </button>
  );
  MockDeleteDialog.displayName = 'MockDeleteDialog';
  return MockDeleteDialog;
});

describe('TaskItem Component', () => {
  const mockUpdate = { mutate: jest.fn() };
  const mockDelete = { mutate: jest.fn() };

  beforeEach(() => {
    (useUpdateTask as jest.Mock).mockReturnValue(mockUpdate);
    (useDeleteTask as jest.Mock).mockReturnValue(mockDelete);
    mockUpdate.mutate.mockClear();
    mockDelete.mutate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders task item with correct title and completion status', () => {
    render(<TaskItem id="1" title="Test Task" completed={false} />);
    const titleText = screen.getByText(/test task/i);
    expect(titleText).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls updateTask.mutate when checkbox is toggled', () => {
    render(<TaskItem id="1" title="Test Task" completed={false} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockUpdate.mutate).toHaveBeenCalledWith({ id: '1', data: { completed: true } });
  });

  it('renders TaskDialog and DeleteDialog components', () => {
    render(<TaskItem id="1" title="Test Task" completed={false} />);
    const taskDialog = screen.getByTestId('task-dialog');
    const deleteDialog = screen.getByTestId('delete-dialog');
    expect(taskDialog).toBeInTheDocument();
    expect(deleteDialog).toBeInTheDocument();
  });

  it('calls deleteTask.mutate when delete is confirmed', () => {
    render(<TaskItem id="1" title="Test Task" completed={false} />);
    const deleteDialog = screen.getByTestId('delete-dialog');
    fireEvent.click(deleteDialog);
    expect(mockDelete.mutate).toHaveBeenCalledWith('1');
  });

  it('renders line-through style for completed tasks', () => {
    render(<TaskItem id="1" title="Test Task" completed={true} />);
    const titleText = screen.getByText(/test task/i);
    expect(titleText).toHaveClass('line-through');
  });
});
