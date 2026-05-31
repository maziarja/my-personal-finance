"use client";

import { CategoryCard } from "@/components/categories/category-card";
import { CategoriesEmpty } from "@/components/categories/categories-empty";
import { CategoriesError } from "@/components/categories/categories-error";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/app/_actions/categoryActions";
import { categoryKey } from "@/lib/query-keys/categories";
import { CategoryListSkeleton } from "@/components/categories/category-list-skeleton";

export function CategoryList() {
  const {
    data: categories,
    isError,
    isPending,
    refetch: onRetry,
  } = useQuery({
    queryKey: categoryKey.list(),
    queryFn: getCategories,
  });

  if (isPending) return <CategoryListSkeleton />;

  if ((categories && "error" in categories) || isError) {
    return <CategoriesError onRetry={onRetry ?? (() => {})} />;
  }

  if (categories?.length === 0) {
    return <CategoriesEmpty />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateCategoryDialog />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
