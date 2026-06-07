import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

type GoalPreviewBarProps = {
  current: number;
  target: number;
  delta: number; // positive = contribution, negative = withdrawal
};

export function GoalPreviewBar({
  current,
  target,
  delta,
}: GoalPreviewBarProps) {
  const projected = current + delta;
  const currentPct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const projectedPct =
    target > 0 ? Math.min((projected / target) * 100, 100) : 0;

  const isWithdrawal = delta < 0;
  const isOverTarget = projected > target;
  const hasDelta = delta !== 0;

  const fadedPct = isWithdrawal ? currentPct : projectedPct;
  const solidPct = isWithdrawal ? projectedPct : currentPct;

  const fadedColor = isWithdrawal
    ? "bg-brand/25"
    : isOverTarget
      ? "bg-destructive/30"
      : "bg-emerald-500/35";

  const projectedLabel = isWithdrawal
    ? cn(
        "font-semibold",
        projected < 0 ? "text-destructive" : "text-foreground",
      )
    : cn(
        "font-semibold",
        isOverTarget
          ? "text-destructive"
          : "text-emerald-600 dark:text-emerald-400",
      );

  const projectedPctLabel = isWithdrawal
    ? "text-foreground"
    : isOverTarget
      ? "text-destructive"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border p-4">
      {/* amount labels */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 tabular-nums">
          <span className="font-medium">{fmt(current)}</span>
          {hasDelta && (
            <>
              <ArrowRight className="text-muted-foreground size-3.5 shrink-0" />
              <span className={projectedLabel}>
                {fmt(Math.max(projected, 0))}
              </span>
            </>
          )}
        </div>
        <span className="text-muted-foreground tabular-nums">
          {fmt(target)} target
        </span>
      </div>

      {/* progress track */}
      <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
        {hasDelta && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
              fadedColor,
            )}
            style={{ width: `${fadedPct}%` }}
          />
        )}
        <div
          className="bg-brand absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{ width: `${solidPct}%` }}
        />
      </div>

      {/* percentage labels */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs tabular-nums">
          <span className="text-muted-foreground">
            {Math.round(currentPct)}%
          </span>
          {hasDelta && (
            <>
              <ArrowRight className="text-muted-foreground size-3 shrink-0" />
              <span className={cn("font-medium", projectedPctLabel)}>
                {Math.round(projectedPct)}%
              </span>
            </>
          )}
        </div>
        {isOverTarget && hasDelta && (
          <span className="text-destructive text-xs">Exceeds target</span>
        )}
        {isWithdrawal && projected < 0 && hasDelta && (
          <span className="text-destructive text-xs">Exceeds balance</span>
        )}
      </div>
    </div>
  );
}
