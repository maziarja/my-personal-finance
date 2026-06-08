"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddContributionDialog } from "@/components/goals/add-contribution-dialog";
import { WithdrawGoalDialog } from "@/components/goals/withdraw-goal-dialog";
import { EditGoalDialog } from "@/components/goals/edit-goal-dialog";
import { DeleteGoalDialog } from "@/components/goals/delete-goal-dialog";

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

function GoalProgressBar({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isOver = current > target;

  const [width, setWidth] = useState(0);

  useEffect(() => {
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setWidth(percentage));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [percentage]);

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isOver && "text-destructive",
          )}
        >
          {Math.round(percentage)}%
        </span>
        {isOver && (
          <span className="text-destructive text-xs font-medium">Over goal</span>
        )}
      </div>
      <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            isOver ? "bg-destructive" : "bg-brand",
          )}
          style={{ width: `${width}%`, transition: "width 0.7s cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
      </div>
    </div>
  );
}

function DeadlineBadge({
  deadline,
  isComplete,
}: {
  deadline: string | null;
  isComplete: boolean;
}) {
  if (!deadline) {
    return (
      <Badge variant="secondary" className="text-xs font-normal">
        No deadline
      </Badge>
    );
  }

  const date = new Date(deadline);
  const isPast = date < new Date() && !isComplete;
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Badge
      variant={isPast ? "destructive" : "secondary"}
      className="text-xs font-normal"
    >
      {isPast ? "Overdue · " : ""}
      {formatted}
    </Badge>
  );
}

type GoalCardProps = {
  goal: Goal;
};

export function GoalCard({ goal }: GoalCardProps) {
  const isComplete = goal.currentAmount >= goal.targetAmount;
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <Card className="flex min-h-52 flex-col gap-0 p-0">
      <div className="flex items-start justify-between px-5 pt-5">
        <p className="font-semibold leading-snug">{goal.name}</p>
        <div className="flex shrink-0 items-center gap-1">
          <AddContributionDialog
              goalId={goal.id}
              goalName={goal.name}
              currentAmount={goal.currentAmount}
              targetAmount={goal.targetAmount}
            />
            <WithdrawGoalDialog
              goalId={goal.id}
              goalName={goal.name}
              currentAmount={goal.currentAmount}
              targetAmount={goal.targetAmount}
            />
          <EditGoalDialog goal={goal} />
          <DeleteGoalDialog goalId={goal.id} goalName={goal.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-4">
        <GoalProgressBar current={goal.currentAmount} target={goal.targetAmount} />
      </div>

      <div className="flex items-end justify-between px-5 pb-5">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">
            {formatCurrency(goal.currentAmount)} saved
          </span>
          {isComplete ? (
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Goal reached!
            </span>
          ) : (
            <span className="text-sm font-medium tabular-nums">
              {formatCurrency(remaining)} to go
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-muted-foreground text-xs">
            {formatCurrency(goal.targetAmount)} target
          </span>
          <DeadlineBadge deadline={goal.deadline} isComplete={isComplete} />
        </div>
      </div>
    </Card>
  );
}
