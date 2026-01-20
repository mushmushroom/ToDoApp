import { toast } from 'sonner';
import { API_URL } from '../constants';
import {
  createCategory,
  createTask,
  deleteCategory,
  deleteTask,
  fetchCategories,
  fetchTask,
  fetchTasks,
  updateCategory,
  updateTask,
} from '../utils';

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe('utils functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchTasks calls correct endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Task 1', completed: false }),
    });

    const result = await fetchTasks();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/tasks`);
    expect(result).toEqual({ id: '1', title: 'Task 1', completed: false });
  });

  it('fetchTasks shows toast in case of an error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks');
    expect(toast.error).toHaveBeenCalledWith('Failed to fetch tasks');
  });

  it('fetchTask calls correct endpoint with the ID', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Task 1', completed: false }),
    });

    const result = await fetchTask('1');
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/tasks/1`);
    expect(result).toEqual({ id: '1', title: 'Task 1', completed: false });
  });

  it('fetchTask shows toast in case of an error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(fetchTask('1')).rejects.toThrow('Failed to fetch a task');
    expect(toast.error).toHaveBeenCalledWith('Failed to fetch a task');
  });

  it('createTask calls the correct endpoint and shows toast on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'New task' }),
    });

    const result = await createTask({ title: 'New task', categoryId: '1' });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/tasks`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(result).toEqual({ id: '1', title: 'New task' });

    expect(toast.success).toHaveBeenCalledWith('The task has been added.');
  });

  it('createTask shows toast on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(createTask({ title: 'New task', categoryId: '1' })).rejects.toThrow(
      'Failed to fetch a task'
    );
    expect(toast.error).toHaveBeenCalledWith('Failed to fetch a task');
  });

  it('updateTask calls the correct endpoint and shows toast on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'New task' }),
    });

    const result = await updateTask('1', { title: 'New task' });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/tasks/1`,
      expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(result).toEqual({ id: '1', title: 'New task' });

    expect(toast.success).toHaveBeenCalledWith('The task has been updated.');
  });

  it('updateTask shows toast on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(updateTask('1', { title: 'New task' })).rejects.toThrow('Failed to update a task');
    expect(toast.error).toHaveBeenCalledWith('Failed to update a task');
  });

  it('deleteTask calls the correct endpoint and shows toast on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'New task' }),
    });

    const result = await deleteTask('1');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/tasks/1`,
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(result).toEqual({ id: '1', title: 'New task' });

    expect(toast.success).toHaveBeenCalledWith('The task has been deleted.');
  });

  it('deleteTask shows toast on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(deleteTask('1')).rejects.toThrow('Failed to delete a task');
    expect(toast.error).toHaveBeenCalledWith('Failed to delete a task');
  });

  it('fetchCategories calls correct endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', name: 'Category 1' }),
    });

    const result = await fetchCategories();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/category`);
    expect(result).toEqual({ id: '1', name: 'Category 1' });
  });

  it('fetchCategories shows toast in case of an error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(fetchCategories()).rejects.toThrow('Failed to fetch categories');
    expect(toast.error).toHaveBeenCalledWith('Failed to fetch categories');
  });

  it('createCategory calls the correct endpoint and shows toast on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', name: 'New category' }),
    });

    const result = await createCategory('New category');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/category`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(result).toEqual({ id: '1', name: 'New category' });

    expect(toast.success).toHaveBeenCalledWith('The category has been added.');
  });

  it('createCategory shows toast on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(createCategory('New category')).rejects.toThrow('Failed to create a category');
    expect(toast.error).toHaveBeenCalledWith('Failed to create a category');
  });

  it('updateCategory calls the correct endpoint and shows toast on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', name: 'New category' }),
    });

    const result = await updateCategory('1', { name: 'New category' });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/category/1`,
      expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(result).toEqual({ id: '1', name: 'New category' });
  });

  it('updateCategory shows toast on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(updateCategory('1', { name: 'New category' })).rejects.toThrow(
      'Failed to update a category'
    );
    expect(toast.error).toHaveBeenCalledWith('Failed to update a category');
  });

  it('deleteCategory calls the correct endpoint and shows toast on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', name: 'New category' }),
    });

    const result = await deleteCategory('1', { deleteTasks: true });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/category/1?deleteTasks=true`,
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(result).toEqual({ id: '1', name: 'New category' });

    expect(toast.success).toHaveBeenCalledWith(
      'The category and all associated tasks have been deleted.'
    );
  });
  it('deleteCategory shows toast on error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    await expect(deleteCategory('1', { deleteTasks: false })).rejects.toThrow(
      'Failed to delete a category'
    );
    expect(toast.error).toHaveBeenCalledWith('Failed to delete a category');
  });
});
