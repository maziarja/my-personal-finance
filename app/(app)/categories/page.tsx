import { getCategories } from "@/app/_actions/categoryActions";
import { CategoryList } from "@/components/categories/category-list";
import { getQueryClient } from "@/lib/helpers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function CategoriesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Manage your spending categories
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryList />
      </HydrationBoundary>
    </div>
  );
}
