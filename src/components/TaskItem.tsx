import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from './ui/button';

interface TaskItemProps {
  title: string;
  completed: boolean;
}

export default function TaskItem({ title, completed }: TaskItemProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between p-3 rounded-md border bg-white hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={completed}
          // onChange={handleToggle}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400 cursor-pointer shrink-0"
        />
        <span className={`text-base ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <Button
          // onClick={handleEdit}
          variant="ghost"
          className="p-2 text-gray-700 border rounded hover:bg-gray-50 cursor-pointer"
          title="Edit a task"
        >
          <FaEdit />
        </Button>
        <Button
          // onClick={handleDelete}
          variant="ghost"
          className="p-2 text-red-600 border rounded hover:bg-red-50 cursor-pointer"
          title="Delete a task"
        >
          <FaTrash />
        </Button>
      </div>
    </div>
  );
}
