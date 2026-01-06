import useGetCategories, { useCreateCategory } from '@/lib/hooks/useCategories';
import { Button } from '../ui/button';
import CategoriesSelect from './CategoriesSelect';
import CategoryDialog from './CategoryDialog';
import { useState } from 'react';

export default function CategoriesSection() {
  const { data } = useGetCategories();
  const createCategory = useCreateCategory();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3 mt-4">
      <CategoriesSelect categories={data} value={selectedCategory} onChange={setSelectedCategory} />
      <Button variant="outline">Manage categories</Button>
      <CategoryDialog onSubmit={(title) => createCategory.mutate(title)} />
    </div>
  );
}
