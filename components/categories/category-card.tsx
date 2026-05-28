"use client";

import { Card } from "@/components/ui/card";
import { EditCategoryDialog } from "@/components/categories/edit-category-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";

export type Category = {
  id: string;
  name: string;
  color: string;
};

type CategoryCardProps = {
  category: Category;
  className?: string;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Card
      className={className}
      style={{
        boxShadow: `0 0 0 0.5px ${category.color}33, 0 4px 24px -4px ${category.color}1a`,
      }}
    >
      <div className="flex items-center justify-between p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <p className="truncate font-medium">{category.name}</p>
        </div>
        <div className="ml-2 flex shrink-0 items-center gap-1">
          <EditCategoryDialog category={category} />
          <DeleteCategoryDialog
            categoryId={category.id}
            categoryName={category.name}
          />
        </div>
      </div>
    </Card>
  );
}
