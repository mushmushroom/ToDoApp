import { Category } from '../types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCategory, fetchCategories } from '../utils';

export default function useGetCategories() {
  return useQuery<Category[]>({ queryKey: ['categories'], queryFn: fetchCategories });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}

