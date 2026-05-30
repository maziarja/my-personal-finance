import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CategoryCardSkeleton() {
  return (
    <Card>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="size-7 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function CategoryListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
