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
import FormField from '../custom/FormField';
import { CHAR_LIMIT } from '@/lib/constants';

const categoryTitleSchema = z.object({
  categoryTitle: z
    .string()
    .trim()
    .min(4, 'The category name should contain at least 4 characters')
    .max(CHAR_LIMIT, `The category name must not exceed ${CHAR_LIMIT} characters`),
});

type categoryTitleInput = z.infer<typeof categoryTitleSchema>;

interface CategoryDialogProps {
  defaultTitle?: string;
  onSubmit: (title: string) => void;
}

const CategoryDialog = ({ defaultTitle, onSubmit }: CategoryDialogProps) => {
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
    // const oldTitle = (defaultTitle ?? '').trim();

    onSubmit(newTitle);
    reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create category</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription>Enter the name of the new category below.</DialogDescription>
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
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CategoryDialog);
