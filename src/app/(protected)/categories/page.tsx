'use client';
import CategoryDialog from '@/components/categories/CategoryDialog';
import CategoryItem from '@/components/categories/CategoryItem';
import ErrorMessage from '@/components/status/ErrorMessage';
import LoadingTasks from '@/components/status/LoadingTasks';
import { Button } from '@/components/ui/button';
import useGetCategories, { useCreateCategory } from '@/lib/hooks/useCategories';
import { AppPath } from '@/lib/links';
import Link from 'next/link';

export default function MyCategories() {
  const createCategory = useCreateCategory();
  const { data: categories, isLoading, isError, refetch } = useGetCategories();
  return (
    <section className="py-3">
      <h1 className="text-center text-2xl mb-5 font-bold">My categories</h1>
      <div className="flex items-center gap-3">
        <CategoryDialog mode="add" onSubmit={(title) => createCategory.mutateAsync(title)} />
        <Button variant="outline" asChild>
          <Link href={AppPath.MyTasks}>Back to the tasks</Link>
        </Button>
      </div>
      <div className="py-7 flex flex-col gap-3">
        {isLoading ? (
          <LoadingTasks />
        ) : isError ? (
          <ErrorMessage title="Error loading tasks" onRetry={refetch} />
        ) : categories && categories?.length > 0 ? (
          categories.map((category) => <CategoryItem key={category.id} category={category} />)
        ) : (
          <p className="mt-6 text-center text-gray-500 italic">
            No categories have been added yet.
          </p>
        )}
      </div>
    </section>
  );
}
