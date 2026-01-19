import React from 'react';
import { Button } from '../ui/button';
import { FaEdit } from 'react-icons/fa';

interface EditButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  title: string;
}

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ title, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        title={title}
        className="p-2 text-gray-700 border rounded hover:bg-gray-50 cursor-pointer"
        {...props}
      >
        <FaEdit />
      </Button>
    );
  }
);

EditButton.displayName = 'EditButton';

export default EditButton;
