import { Tags } from "lucide-react";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";

export function CategoriesEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-muted flex size-12 items-center justify-center rounded-full">
        <Tags className="text-muted-foreground size-6" />
      </div>
      <div>
        <p className="font-medium">No categories yet</p>
        <p className="text-muted-foreground text-sm">
          Create your first category to start organizing your finances.
        </p>
      </div>
      <CreateCategoryDialog />
    </div>
  );
}
