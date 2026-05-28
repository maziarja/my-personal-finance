import { CategoryList } from "@/components/categories/category-list";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Manage your spending categories
        </p>
      </div>
      <CategoryList categories={[]} />
    </div>
  );
}
