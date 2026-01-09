import React, { memo } from 'react';
import { Category } from '@/lib/types/types';
import CategoryDialog from './CategoryDialog';
import DeleteDialog from '../common/DeleteDialog';
import { useDeleteCategory, useUpdateCategory } from '@/lib/hooks/useCategories';

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between p-3 rounded-md border bg-white hover:shadow-sm transition">
      <div>
        <div className="flex items-center gap-3">{category.name}</div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <CategoryDialog
          mode="edit"
          defaultTitle={category.name}
          onSubmit={(name) => updateCategory.mutate({ id: category.id, data: { name } })}
        />

        <DeleteDialog
          type="category"
          title={category.name}
          onConfirm={({ deleteTasks }) =>
            deleteCategory.mutate({
              id: category.id,
              deleteTasks: deleteTasks,
            })
          }
        />
      </div>
    </div>
  );
};

export default memo(CategoryItem);
