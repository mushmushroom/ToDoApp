import React, { memo } from 'react';
import { Category } from '@/lib/types/types';
import CategoryDialog from './CategoryDialog';
import DeleteDialog from '../common/DeleteDialog';
import { useDeleteCategory, useUpdateCategory } from '@/lib/hooks/useCategories';
import { itemStyles } from '@/lib/sharedStyles';

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  return (
    <div className={itemStyles.outerDivStyles}>
      <div>
        <div className={itemStyles.titleText}>{category.name}</div>
      </div>

      <div className={itemStyles.buttonOuterDiv}>
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
