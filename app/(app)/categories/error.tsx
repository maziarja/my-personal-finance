"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CategoriesError({ reset }: { reset: () => void }) {
  const router = useRouter();

  function handleRetry() {
    router.refresh();
    reset();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Manage your spending categories
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="font-medium">Something went wrong</p>
          <p className="text-muted-foreground text-sm">
            Failed to load your categories.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
}
