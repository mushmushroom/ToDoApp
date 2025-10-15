'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { FaEdit } from 'react-icons/fa';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormField from './custom/FormField';
import { CHAR_LIMIT } from '@/lib/constants';

const taskTitleSchema = z.object({
  taskTitle: z
    .string()
    .trim()
    .min(5, 'The task should contain at least 5 characters')
    .max(CHAR_LIMIT, `The task title must not exceed ${CHAR_LIMIT} characters`),
});

type TaskTitleInput = z.infer<typeof taskTitleSchema>;

type Mode = 'add' | 'edit';

interface TaskDialogProps {
  mode: Mode;
  defaultTitle?: string;
  onSubmit: (title: string) => void;
}

export default function TaskDialog({ mode, defaultTitle, onSubmit }: TaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm<TaskTitleInput>({
    resolver: zodResolver(taskTitleSchema),
    mode: 'onChange',
    defaultValues: { taskTitle: defaultTitle ?? '' },
  });

  useEffect(() => {
    if (isOpen) reset({ taskTitle: defaultTitle ?? '' });
  }, [defaultTitle, isOpen, reset]);

  async function handleFormSubmit(data: TaskTitleInput) {
    const newTitle = data.taskTitle.trim();
    const oldTitle = (defaultTitle ?? '').trim();

    // Don’t send request if nothing changed
    if (mode === 'edit' && newTitle === oldTitle) {
      setIsOpen(false);
      return;
    }

    onSubmit(newTitle);
    reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === 'add' ? (
          <Button variant="default">Add new task</Button>
        ) : (
          <Button
            variant="ghost"
            className="p-2 text-gray-700 border rounded hover:bg-gray-50 cursor-pointer"
            title="Edit a task"
          >
            <FaEdit />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add a new task' : 'Edit this task'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Enter the title of your new task below.'
              : 'Update the title of your task.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <FormField
            className="flex-grow"
            placeholder="e.g. Get groceries"
            id="taskTitle"
            type="text"
            label="Task title"
            registration={register('taskTitle', { required: true })}
            errors={errors.taskTitle}
            hasLabelHidden
            watch={watch}
          />

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
