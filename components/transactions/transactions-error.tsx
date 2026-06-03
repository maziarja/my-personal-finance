"use client";

import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

type TransactionsErrorProps = {
  onRetry: () => void;
};

export function TransactionsError({ onRetry }: TransactionsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-muted flex size-12 items-center justify-center rounded-full">
        <ServerCrash className="text-muted-foreground size-6" />
      </div>
      <div>
        <p className="font-medium">Something went wrong</p>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t load your transactions. Please try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
