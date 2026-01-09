'use client';
import CategoriesSection from '@/components/categories/CategoriesSection';
import ErrorMessage from '@/components/status/ErrorMessage';
import LoadingTasks from '@/components/status/LoadingTasks';
import TaskDialog from '@/components/tasks/TaskDialog';
import TaskItem from '@/components/tasks/TaskItem';
import { useAllTasks, useCreateTask } from '@/lib/hooks/useTasks';
import { useState } from 'react';

type CategoryFilter = 'all' | 'none' | string;

export default function MyTasks() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const {
    data: tasks,
    isLoading,
    isError,
    refetch,
  } = useAllTasks(categoryFilter === 'all' ? undefined : categoryFilter);
  const createTask = useCreateTask();

  return (
    <section className="py-3">
      <h1 className="text-center text-2xl mb-5 font-bold">My tasks</h1>
      <TaskDialog
        mode="add"
        onSubmit={(title, categoryId) => createTask.mutate({ title, categoryId })}
      />
      <CategoriesSection value={categoryFilter} onChange={setCategoryFilter} />
      <div className="py-7 flex flex-col gap-3">
        {isLoading ? (
          <LoadingTasks />
        ) : isError ? (
          <ErrorMessage title="Error loading tasks" onRetry={refetch} />
        ) : tasks && tasks?.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <p className="mt-6 text-center text-gray-500 italic">No tasks have been added yet.</p>
        )}
      </div>
    </section>
  );
}
