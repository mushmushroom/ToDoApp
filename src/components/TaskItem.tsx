import React, { memo } from 'react';
import TaskDialog from './TaskDialog';
import { useDeleteTask, useUpdateTask } from '@/lib/hooks/useTasks';
import DeleteDialog from './DeleteDialog';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TaskItem = ({ id, title, completed }: TaskItemProps) => {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between p-3 rounded-md border bg-white hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => updateTask.mutate({ id, data: { completed: !completed } })}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400 cursor-pointer shrink-0"
        />
        <span className={`text-base ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <TaskDialog
          mode="edit"
          defaultTitle={title}
          onSubmit={(title) => updateTask.mutate({ id, data: { title } })}
        />
        <DeleteDialog title={title} onConfirm={() => deleteTask.mutate(id)} />
      </div>
    </div>
  );
};

export default memo(TaskItem);
