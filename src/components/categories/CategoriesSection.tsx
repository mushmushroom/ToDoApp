import useGetCategories, { useCreateCategory } from '@/lib/hooks/useCategories';
import { Button } from '../ui/button';
import CategoriesSelect from './CategoriesSelect';
import CategoryDialog from './CategoryDialog';

export default function CategoriesSection() {
  const { data } = useGetCategories();
  const createCategory = useCreateCategory();
  return (
    <div className="flex items-center gap-3 mt-4">
      <CategoriesSelect categories={data} />
      <CategoryDialog onSubmit={(title) => createCategory.mutate(title)} />
    </div>
  );
}
