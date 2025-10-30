'use client';
import ErrorMessage from '@/components/status/ErrorMessage';
import LoadingTasks from '@/components/status/LoadingTasks';
import TaskDialog from '@/components/tasks/TaskDialog';
import TaskItem from '@/components/tasks/TaskItem';
import { useAllTasks, useCreateTask } from '@/lib/hooks/useTasks';

export default function MyTasks() {
  const { data: tasks, isLoading, isError, refetch } = useAllTasks();
  const createTask = useCreateTask();

  return (
    <section className="py-3">
      <TaskDialog mode="add" onSubmit={(title) => createTask.mutate(title)} />
      <div className="py-7 flex flex-col gap-3">
        {isLoading ? (
          <LoadingTasks />
        ) : isError ? (
          <ErrorMessage title="Error loading tasks" onRetry={refetch} />
        ) : tasks && tasks?.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} id={task.id} completed={task.completed} title={task.title} />
          ))
        ) : (
          <p className="mt-6 text-center text-gray-500 italic">No tasks have been added yet.</p>
        )}
      </div>
    </section>
  );
}
