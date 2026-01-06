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
  onChange?: (value: string | null) => void;
}
export default function CategoriesSelect({
  categories = [],
  value,
  onChange,
}: CategoriesSelectProps) {
  if (!categories) {
    return null;
  }

  return (
    <Select
      value={value ?? undefined}
      onValueChange={(value) => onChange?.(value === 'none' ? null : value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
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
