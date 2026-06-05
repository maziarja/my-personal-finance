"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BudgetsError({ reset }: { reset: () => void }) {
  const router = useRouter();

  function handleRetry() {
    router.refresh();
    reset();
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <p className="text-muted-foreground text-sm">
          Set monthly spending limits per category
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="font-medium">Something went wrong</p>
          <p className="text-muted-foreground text-sm">
            Failed to load your budgets.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
}
