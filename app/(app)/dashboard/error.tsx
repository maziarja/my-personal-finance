"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-brand/45 border-l-2 pl-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your financial snapshot at a glance
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive size-6" />
        </div>
        <div>
          <p className="font-medium">Something went wrong</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
