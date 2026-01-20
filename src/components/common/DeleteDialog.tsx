import { FaTrash } from 'react-icons/fa';
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
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { memo, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface DeleteDialogProps {
  onConfirm: (options: { deleteTasks: boolean }) => void;
  title: string;
  type: 'task' | 'category';
}
const DeleteDialog = ({ onConfirm, title, type }: DeleteDialogProps) => {
  const [deleteTasks, setDeleteTasks] = useState(false);

  const handleConfirm = () => {
    onConfirm({ deleteTasks });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 text-red-600 border rounded hover:bg-red-50 cursor-pointer"
          title={`Delete a ${type}`}
        >
          <FaTrash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete the {type} <span className="font-bold text-primary">{title}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {type}. If you do not select the option below, any tasks associated with this category will remain.
            {type === 'category' && (
              <span className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="remove-tasks"
                  checked={deleteTasks}
                  onCheckedChange={(v) => setDeleteTasks(!!v)}
                />
                <Label className="text-gray-800" htmlFor="remove-tasks">
                  Delete all tasks in this category
                </Label>
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(DeleteDialog);
