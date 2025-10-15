import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs';
import { API_URL } from './constants';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saltAndHashPassword(password: string) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export async function fetchTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
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

export async function createTask(title: string) {
  try {
    const response = await fetch(`${API_URL}/tasks/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) throw new Error('Failed to fetch a task');
    toast.success('The task has been added.');
    return await response.json();
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
}

export async function updateTask(id: string, data: Partial<{ title: string; completed: boolean }>) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to fetch a task');
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
