'use client';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import { useAllTasks } from '@/lib/hooks/useTasks';

export default function MyTasks() {
  const { data: tasks, isLoading, isError } = useAllTasks();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>
  return (
    <section className="py-3">
      <AddTaskForm />
      {tasks && tasks?.length > 0 ? (
        tasks.map((task) => (
        <p key={task.id}>{task.title}</p>
      ))
      ) : (<p>No tasks have been created yet</p>)}
    </section>
  );
}
