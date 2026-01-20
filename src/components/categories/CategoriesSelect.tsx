import { Category } from '@/lib/types/types';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectLabel,
} from '../ui/select';

interface CategoriesSelectProps {
  categories?: Category[];
  value?: string | null;
  onChange?: (value: string) => void;
  allowAll?: boolean;
}
export default function CategoriesSelect({
  categories = [],
  value,
  onChange,
  allowAll = true,
}: CategoriesSelectProps) {
  if (!categories) {
    return null;
  }

  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {allowAll && <SelectItem value="all">All tasks</SelectItem>}
          <SelectItem value="none">No category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
