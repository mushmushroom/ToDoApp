import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { API_URL } from './constants';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchTasks(categoryId?: string) {
  try {
    const response = await fetch(
      `${API_URL}/tasks${categoryId && categoryId !== 'all' ? `?category=${categoryId}` : ''}`
    );
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}

export async function fetchTask(id: string) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch a task');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}

type CreateTaskInput = {
  title: string;
  categoryId: string | null;
};

export async function createTask({ title, categoryId }: CreateTaskInput) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, categoryId }),
    });

    if (!response.ok) throw new Error('Failed to fetch a task');
    toast.success('The task has been added.');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}

export async function updateTask(
  id: string,
  data: Partial<{ title: string; completed: boolean; categoryId: string | null }>
) {
  console.log(data);
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update a task');
    toast.success('The task has been updated.');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}

export async function deleteTask(id: string) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to fetch a task');
    toast.success('The task has been deleted.');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/category`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}

export async function createCategory(name: string) {
  try {
    const response = await fetch(`${API_URL}/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error('Failed to create a category');
    toast.success('The category has been added.');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}
