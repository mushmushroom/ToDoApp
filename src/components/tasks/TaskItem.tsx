import React, { memo } from 'react';
import TaskDialog from './TaskDialog';
import { useDeleteTask, useUpdateTask } from '@/lib/hooks/useTasks';
import DeleteDialog from '../common/DeleteDialog';
import { Task } from '@/lib/types/types';
import { itemStyles } from '@/lib/sharedStyles';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  return (
    <div
      className={`${itemStyles.outerDivStyles}   `}
    >
      <div>
        <div className={`${itemStyles.titleText} mb-3`}>
          <input
            aria-checked={task.completed}
            aria-label={task.completed ? "Completed" : "Not completed"}
            type="checkbox"
            checked={task.completed}
            onChange={() =>
              updateTask.mutate({ id: task.id, data: { completed: !task.completed } })
            }
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400 cursor-pointer shrink-0"
          />
          <span
            className={`text-base ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {task.title}
          </span>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium  ${
            task.categories ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500 '
          }`}
        >
          {task.categories?.name ?? 'No category assigned'}
        </span>
      </div>

      <div className={itemStyles.buttonOuterDiv}>
        <TaskDialog
          mode="edit"
          defaultTitle={task.title}
          defaultCategoryId={task.categories?.id ?? 'none'}
          onSubmit={(title, categoryId) =>
            updateTask.mutate({ id: task.id, data: { title, categoryId } })
          }
        />
        <DeleteDialog type="task" title={task.title} onConfirm={() => deleteTask.mutate(task.id)} />
      </div>
    </div>
  );
};

export default memo(TaskItem);
