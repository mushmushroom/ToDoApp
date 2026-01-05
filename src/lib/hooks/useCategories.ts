import { Category } from '../types/types';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../utils';

export default function useGetCategories() {
  return useQuery<Category[]>({ queryKey: ['categories'], queryFn: fetchCategories });
}
