import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, fetchTask, fetchTasks, updateTask } from '../utils';
import { Task } from '../types/types';

export function useAllTasks() {
  return useQuery<Task[]>({ queryKey: ['tasks'], queryFn: fetchTasks });
}

export function useTask(id: string) {
  return useQuery<Task>({ queryKey: ['tasks', id], queryFn: () => fetchTask(id) });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ title: string; completed: boolean }>;
    }) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
