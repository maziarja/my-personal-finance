import { CategoryListSkeleton } from "@/components/categories/category-list-skeleton";

export default function CategoriesLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-l-2 border-brand/45 pl-3">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Manage your spending categories
        </p>
      </div>
      <CategoryListSkeleton />
    </div>
  );
}
