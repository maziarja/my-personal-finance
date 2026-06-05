"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EditBudgetDialog } from "@/components/budgets/edit-budget-dialog";
import { DeleteBudgetDialog } from "@/components/budgets/delete-budget-dialog";

export type Budget = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  monthlyLimit: number;
  spentAmount: number;
  month: string;
};

export type BudgetCategory = {
  id: string;
  name: string;
  color: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

const formatMonth = (month: string) =>
  new Date(month.slice(0, 7) + "-01T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

function BudgetProgressRing({
  spent,
  limit,
  color,
}: {
  spent: number;
  limit: number;
  color: string;
}) {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOverBudget = spent > limit;
  const stroke = isOverBudget ? "#ef4444" : color;

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;

  // Start fully empty, then animate to target after mount.
  // Double RAF ensures the browser has painted the initial state
  // before the transition fires.
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setOffset(targetOffset));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [targetOffset]);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={120} height={120} className="-rotate-90">
        <circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={12}
        />
        <circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={12}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-tight">
        <span
          className={cn(
            "text-lg font-bold tabular-nums",
            isOverBudget && "text-destructive",
          )}
        >
          {Math.round(percentage)}%
        </span>
        {isOverBudget && (
          <span className="text-destructive text-xs font-medium">Over</span>
        )}
      </div>
    </div>
  );
}

type BudgetCardProps = {
  budget: Budget;
  categories: BudgetCategory[];
  className?: string;
};

export function BudgetCard({ budget, categories, className }: BudgetCardProps) {
  const isOverBudget = budget.spentAmount > budget.monthlyLimit;
  const remaining = budget.monthlyLimit - budget.spentAmount;

  return (
    <Card className={cn("flex min-h-52 flex-col gap-0 p-0", className)}>
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: budget.categoryColor }}
          />
          <p className="font-semibold capitalize">{budget.categoryName}</p>
        </div>
        <div className="flex items-center gap-1">
          <EditBudgetDialog budget={budget} categories={categories} />
          <DeleteBudgetDialog
            budgetId={budget.id}
            categoryName={budget.categoryName}
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center py-2">
        <BudgetProgressRing
          spent={budget.spentAmount}
          limit={budget.monthlyLimit}
          color={budget.categoryColor}
        />
      </div>

      <div className="flex items-end justify-between px-5 pb-5">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">
            {formatCurrency(budget.spentAmount)} spent
          </span>
          <span className="text-sm font-medium tabular-nums">
            {isOverBudget ? (
              <span className="text-destructive">
                {formatCurrency(Math.abs(remaining))} over
              </span>
            ) : (
              <span>{formatCurrency(remaining)} left</span>
            )}
          </span>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground text-xs">
            {formatCurrency(budget.monthlyLimit)} limit
          </span>
          <p className="text-muted-foreground text-xs">
            {formatMonth(budget.month)}
          </p>
        </div>
      </div>
    </Card>
  );
}
