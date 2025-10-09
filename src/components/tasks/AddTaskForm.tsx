'use client';
import FormField from '../custom/FormField';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';

const newTaskSchema = z.object({
  taskTitle: z.string().min(5, 'The task should contain at least 5 characters'),
});

type NewTaskInput = z.infer<typeof newTaskSchema>;

export default function AddTaskForm() {
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<NewTaskInput>({ resolver: zodResolver(newTaskSchema) });
  return (
    <form className="flex gap-3 max-w-lg w-full">
      <FormField
        className="flex-grow"
        placeholder="Get groceries"
        id="taskTitle"
        type="text"
        label="Task title"
        registration={register('taskTitle', { required: true })}
        errors={errors.taskTitle}
        hasLabelHidden
      />
      <Button className="cursor-pointer">{isSubmitting ? "Adding..." : "Add task"}</Button>
    </form>
  );
}
