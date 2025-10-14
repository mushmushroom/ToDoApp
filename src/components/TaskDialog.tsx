import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { FaEdit } from 'react-icons/fa';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormField from './custom/FormField';
import { CHAR_LIMIT } from '@/lib/constants';
// import { useCreateTask, useUpdateTask } from '@/lib/hooks/useTasks';

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
    onSubmit(data.taskTitle);
    reset();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {mode === 'add' ? (
          <Button className="cursor-pointer" variant="default">
            {mode === 'add' ? 'Add new task' : 'Edit'}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="p-2 text-gray-700 border rounded hover:bg-gray-50 cursor-pointer"
            title="Edit a task"
          >
            <FaEdit />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'add' ? 'Add a new task' : 'Edit this task'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'add'
              ? 'Enter the title of your new task below.'
              : 'Update the title of your task.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 max-w-lg w-full">
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
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit(handleFormSubmit)}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
