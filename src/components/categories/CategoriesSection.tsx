import useGetCategories, { useCreateCategory } from '@/lib/hooks/useCategories';
import { Button } from '../ui/button';
import CategoriesSelect from './CategoriesSelect';
import CategoryDialog from './CategoryDialog';
import Link from 'next/link';
import { AppPath } from '@/lib/links';

interface CategoriesSectionProps {
  value: 'all' | 'none' | string;
  onChange: (value: 'all' | 'none' | string) => void;
}

export default function CategoriesSection({ value, onChange }: CategoriesSectionProps) {
  const { data } = useGetCategories();
  

  return (
    <div className="flex items-center gap-3 mt-4">
      <CategoriesSelect categories={data} value={value} onChange={onChange} />
      <Button variant="outline" asChild>
        <Link href={AppPath.MyCategories}>Manage categories</Link>
      </Button>
    </div>
  );
}
