'use client';
import TaskDialog from '@/components/TaskDialog';
import TaskItem from '@/components/TaskItem';
import { useAllTasks, useCreateTask } from '@/lib/hooks/useTasks';

export default function MyTasks() {
  const { data: tasks, isLoading, isError } = useAllTasks();
  const createTask = useCreateTask();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>
  return (
    <section className="py-3">
      <TaskDialog mode="add" onSubmit={(title) => createTask.mutate(title)} />
      <div className="py-7 flex flex-col gap-3">
        {tasks && tasks?.length > 0 ? (
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
