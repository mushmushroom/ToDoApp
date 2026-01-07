import useGetCategories, { useCreateCategory } from '@/lib/hooks/useCategories';
import { Button } from '../ui/button';
import CategoriesSelect from './CategoriesSelect';
import CategoryDialog from './CategoryDialog';

interface CategoriesSectionProps {
  value: 'all' | 'none' | string;
  onChange: (value: 'all' | 'none' | string) => void;
}

export default function CategoriesSection({ value, onChange }: CategoriesSectionProps) {
  const { data } = useGetCategories();
  const createCategory = useCreateCategory();
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3 mt-4">
      <CategoriesSelect categories={data} value={value} onChange={onChange} />
      <Button variant="outline">Manage categories</Button>
      <CategoryDialog onSubmit={(title) => createCategory.mutate(title)} />
    </div>
  );
}
