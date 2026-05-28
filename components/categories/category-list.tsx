"use client";

import { CategoryCard, type Category } from "@/components/categories/category-card";
import { CategoriesEmpty } from "@/components/categories/categories-empty";
import { CategoriesError } from "@/components/categories/categories-error";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";

interface CategoryListProps {
  categories: Category[];
  isError?: boolean;
  onRetry?: () => void;
}

export function CategoryList({
  categories,
  isError,
  onRetry,
}: CategoryListProps) {
  if (isError) {
    return <CategoriesError onRetry={onRetry ?? (() => {})} />;
  }

  if (categories.length === 0) {
    return <CategoriesEmpty />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateCategoryDialog />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
