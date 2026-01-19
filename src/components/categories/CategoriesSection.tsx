import useGetCategories from '@/lib/hooks/useCategories';
import { Button } from '../ui/button';
import CategoriesSelect from './CategoriesSelect';
import Link from 'next/link';
import { AppPath } from '@/lib/links';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

interface CategoriesSectionProps {
  value: 'all' | 'none' | string;
  onChange: (value: 'all' | 'none' | string) => void;
  isDemo?: boolean;
}

export default function CategoriesSection({
  value,
  onChange,
  isDemo = false,
}: CategoriesSectionProps) {
  const { data } = useGetCategories();

  return (
    <div className="flex items-center gap-3 mt-4">
      <CategoriesSelect categories={data} value={value} onChange={onChange} />
      {isDemo ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <Button variant="outline" disabled>
                Manage categories
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>This feature is not available for demo accounts</TooltipContent>
        </Tooltip>
      ) : (
        <Button variant="outline" asChild>
          <Link href={AppPath.MyCategories}>Manage categories</Link>
        </Button>
      )}
    </div>
  );
}
