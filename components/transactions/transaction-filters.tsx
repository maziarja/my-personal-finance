"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import { useTransactionFiltersStore } from "@/hooks/useTransactionFiltersStore";
import { TransactionType } from "@/app/generated/prisma/enums";

type TransactionFiltersProps = {
  accounts: AccountOption[];
  categories: CategoryOption[];
};

const TYPE_LABELS: Record<string, string> = {
  INCOME: "Income",
  EXPENSE: "Expense",
};

export function TransactionFilters({
  accounts,
  categories,
}: TransactionFiltersProps) {
  const accountId = useTransactionFiltersStore((state) => state.accountId);
  const setAccountId = useTransactionFiltersStore(
    (state) => state.setAccountId,
  );
  const categoryId = useTransactionFiltersStore((state) => state.categoryId);
  const setCategoryId = useTransactionFiltersStore(
    (state) => state.setCategoryId,
  );
  const type = useTransactionFiltersStore((state) => state.type);
  const setType = useTransactionFiltersStore((state) => state.setType);

  const from = useTransactionFiltersStore((state) => state.from);
  const setFrom = useTransactionFiltersStore((state) => state.setFrom);

  const to = useTransactionFiltersStore((state) => state.to);
  const setTo = useTransactionFiltersStore((state) => state.setTo);

  const accName = accounts.find((a) => a.id === accountId)?.name;
  const selectedCat = categories.find((c) => c.id === categoryId);
  const typeName = type ? TYPE_LABELS[type] : null;

  function handleReset() {
    setAccountId(null);
    setCategoryId(null);
    setType(null);
    setFrom("");
    setTo("");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={accountId ?? ""} onValueChange={setAccountId}>
        <SelectTrigger className="h-8 w-36 text-xs">
          <span className={cn("text-xs", !accName && "text-muted-foreground")}>
            {accName ?? "All accounts"}
          </span>
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={categoryId ?? ""} onValueChange={setCategoryId}>
        <SelectTrigger className="h-8 w-36 text-xs">
          <span
            className={cn("text-xs", !selectedCat && "text-muted-foreground")}
          >
            {selectedCat ? (
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: selectedCat.color }}
                />
                {selectedCat.name}
              </span>
            ) : (
              "All categories"
            )}
          </span>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <div
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type ?? ""} onValueChange={setType}>
        <SelectTrigger className="h-8 w-28 text-xs">
          <span className={cn("text-xs", !typeName && "text-muted-foreground")}>
            {typeName ?? "All types"}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TransactionType["INCOME"]}>Income</SelectItem>
          <SelectItem value={TransactionType["EXPENSE"]}>Expense</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="date"
          className="h-8 w-36 text-xs"
          aria-label="From date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <span className="text-muted-foreground text-xs">to</span>
        <Input
          type="date"
          className="h-8 w-36 text-xs"
          aria-label="To date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs"
        onClick={handleReset}
      >
        Reset
      </Button>
    </div>
  );
}
