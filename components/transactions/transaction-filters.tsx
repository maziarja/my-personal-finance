"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";

type TransactionFiltersProps = {
  accounts: AccountOption[];
  categories: CategoryOption[];
};

export function TransactionFilters({
  accounts,
  categories,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select>
        <SelectTrigger className="h-8 w-36 text-xs">
          <span className="text-muted-foreground text-xs">All accounts</span>
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-8 w-36 text-xs">
          <span className="text-muted-foreground text-xs">All categories</span>
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

      <Select>
        <SelectTrigger className="h-8 w-28 text-xs">
          <span className="text-muted-foreground text-xs">All types</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="INCOME">Income</SelectItem>
          <SelectItem value="EXPENSE">Expense</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="date"
          className="h-8 w-36 text-xs"
          aria-label="From date"
        />
        <span className="text-muted-foreground text-xs">to</span>
        <Input type="date" className="h-8 w-36 text-xs" aria-label="To date" />
      </div>

      <Button variant="outline" size="sm" className="h-8 text-xs">
        Reset
      </Button>
    </div>
  );
}
