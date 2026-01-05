import useGetCategories from '@/lib/hooks/useCategories';
import { Button } from '../ui/button';
import CategoriesSelect from './CategoriesSelect';

export default function CategoriesSection() {
  const { data } = useGetCategories();
  return (
    <div className="flex items-center gap-3 mt-4">
      <CategoriesSelect categories={data} />
      <Button variant="outline">Add Category</Button>
    </div>
  );
}
