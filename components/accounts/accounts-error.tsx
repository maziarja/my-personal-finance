import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

type AccountsErrorProps = {
  onRetry: () => void;
};

export function AccountsError({ onRetry }: AccountsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-muted flex size-12 items-center justify-center rounded-full">
        <ServerCrash className="text-muted-foreground size-6" />
      </div>
      <div>
        <p className="font-medium">Something went wrong</p>
        <p className="text-muted-foreground text-sm">
          We couldn't load your accounts. Please try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
