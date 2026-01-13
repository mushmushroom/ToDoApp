import React from 'react'
import { Button } from '../ui/button';
import { FaEdit } from 'react-icons/fa';

interface EditButtonProps {
  title: string;
}
export default function EditButton({title}: EditButtonProps) {
  return (
    <Button
      variant="ghost"
      className="p-2 text-gray-700 border rounded hover:bg-gray-50 cursor-pointer"
      title={title}
    >
      <FaEdit />
    </Button>
  );
}
