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
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormField from '../common/FormField';
import { CHAR_LIMIT } from '@/lib/constants';
import { DialogMode } from '@/lib/types/types';
import EditButton from '../common/EditButton';

const categoryTitleSchema = z.object({
  categoryTitle: z
    .string()
    .trim()
    .min(4, 'The category name should contain at least 4 characters')
    .max(CHAR_LIMIT, `The category name must not exceed ${CHAR_LIMIT} characters`),
});

type categoryTitleInput = z.infer<typeof categoryTitleSchema>;

interface CategoryDialogProps {
  mode: DialogMode;
  defaultTitle?: string;
  onSubmit: (title: string) => void;
}

const CategoryDialog = ({ mode, defaultTitle, onSubmit }: CategoryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm<categoryTitleInput>({
    resolver: zodResolver(categoryTitleSchema),
    mode: 'onChange',
    defaultValues: { categoryTitle: defaultTitle ?? '' },
  });

  useEffect(() => {
    if (isOpen) reset({ categoryTitle: defaultTitle ?? '' });
  }, [defaultTitle, isOpen, reset]);

  async function handleFormSubmit(data: categoryTitleInput) {
    const newTitle = data.categoryTitle.trim();
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
          <Button variant="default">Add new category</Button>
        ) : (
          <EditButton title="Edit a category" />
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add a new category' : 'Edit this category'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Enter the name of the new category below.'
              : 'Update the name of the category.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <FormField
            className="flex-grow"
            placeholder="e.g. Work, Personal, Shopping..."
            id="taskTitle"
            type="text"
            label="Task title"
            registration={register('categoryTitle', { required: true })}
            errors={errors.categoryTitle}
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
};

export default memo(CategoryDialog);
