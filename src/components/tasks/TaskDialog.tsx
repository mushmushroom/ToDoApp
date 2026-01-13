'use client';

import React, { memo, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { FaEdit } from 'react-icons/fa';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import FormField from '../common/FormField';
import { CHAR_LIMIT } from '@/lib/constants';
import CategoriesSelect from '../categories/CategoriesSelect';
import useGetCategories from '@/lib/hooks/useCategories';
import { DialogMode } from '@/lib/types/types';
import EditButton from '../common/EditButton';

const taskTitleSchema = z.object({
  taskTitle: z
    .string()
    .trim()
    .min(5, 'The task should contain at least 5 characters')
    .max(CHAR_LIMIT, `The task title must not exceed ${CHAR_LIMIT} characters`),
  categoryId: z.string().nullable().optional(),
});

type TaskTitleInput = z.infer<typeof taskTitleSchema>;

interface TaskDialogProps {
  mode: DialogMode;
  defaultTitle?: string;
  defaultCategoryId?: string | null;
  onSubmit: (title: string, categoryId: string | null) => void;
}

const TaskDialog = ({ mode, defaultTitle, defaultCategoryId, onSubmit }: TaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = useGetCategories();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
    control,
  } = useForm<TaskTitleInput>({
    resolver: zodResolver(taskTitleSchema),
    mode: 'onChange',
    defaultValues: { taskTitle: defaultTitle ?? '', categoryId: defaultCategoryId ?? null },
  });

  useEffect(() => {
    if (isOpen) reset({ taskTitle: defaultTitle ?? '', categoryId: defaultCategoryId ?? null });
  }, [defaultTitle, isOpen, reset]);

  async function handleFormSubmit(data: TaskTitleInput) {
    const newTitle = data.taskTitle.trim();
    const oldTitle = (defaultTitle ?? '').trim();

    // Don’t send request if nothing changed
    if (mode === 'edit' && newTitle === oldTitle && data.categoryId === defaultCategoryId) {
      setIsOpen(false);
      return;
    }

    onSubmit(newTitle, data.categoryId ?? null);
    reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === 'add' ? (
          <Button variant="default">Add new task</Button>
        ) : (
         <EditButton title="Edit a task" />
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
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategoriesSelect
                categories={categories ?? []}
                value={field.value ?? 'none'}
                onChange={field.onChange}
                allowAll={false}
              />
            )}
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
};

export default memo(TaskDialog);
