"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, NotebookPen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EditTransactionDialog } from "@/components/transactions/edit-transaction-dialog";
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import type {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import { AccountType } from "@/app/generated/prisma/enums";

export type Transaction = {
  id: string;
  amount: string | number;
  type: "INCOME" | "EXPENSE";
  date: string | Date;
  notes?: string | null;
  category: { id: string; name: string; color: string };
  financialAccount: { id: string; name: string; type: AccountType };
};

type SortColumn = "date" | "amount" | "type" | "category" | "account";
type SortDirection = "asc" | "desc";

type TransactionTableProps = {
  transactions: Transaction[];
  accounts: AccountOption[];
  categories: CategoryOption[];
};

const COLUMNS: { key: SortColumn; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "type", label: "Type" },
  { key: "category", label: "Category" },
  { key: "account", label: "Account" },
  { key: "amount", label: "Amount" },
];

function SortIcon({
  column,
  activeColumn,
  direction,
}: {
  column: SortColumn;
  activeColumn: SortColumn | null;
  direction: SortDirection;
}) {
  if (activeColumn !== column) {
    return <ChevronsUpDown className="text-muted-foreground/50 size-3.5" />;
  }
  return direction === "asc" ? (
    <ChevronUp className="size-3.5" />
  ) : (
    <ChevronDown className="size-3.5" />
  );
}

export function TransactionTable({
  transactions,
  accounts,
  categories,
}: TransactionTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map(({ key, label }) => (
              <TableHead
                key={key}
                className="cursor-pointer select-none"
                onClick={() => handleSort(key)}
              >
                <div className="flex items-center gap-1">
                  {label}
                  <SortIcon
                    column={key}
                    activeColumn={sortColumn}
                    direction={sortDirection}
                  />
                </div>
              </TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              accounts={accounts}
              categories={categories}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TransactionRow({
  transaction,
  accounts,
  categories,
}: {
  transaction: Transaction;
  accounts: AccountOption[];
  categories: CategoryOption[];
}) {
  const formattedDate =
    typeof transaction.date === "string"
      ? new Date(transaction.date).toLocaleDateString()
      : transaction.date.toLocaleDateString();

  const formattedAmount = Number(transaction.amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{formattedDate}</TableCell>

      <TableCell>
        <Badge
          className={cn(
            transaction.type === "INCOME"
              ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {transaction.type === "INCOME" ? "Income" : "Expense"}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <div
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: transaction.category.color }}
          />
          <span>{transaction.category.name}</span>
          {transaction.notes && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={<span className="inline-flex" tabIndex={0} />}>
                  <NotebookPen className="text-muted-foreground size-3.5 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>{transaction.notes}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {transaction.financialAccount.name}
      </TableCell>

      <TableCell
        className={cn(
          "font-medium tabular-nums",
          transaction.type === "INCOME"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400",
        )}
      >
        {transaction.type === "INCOME" ? "+" : "-"}
        {formattedAmount}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1">
          <EditTransactionDialog
            transaction={transaction}
            accounts={accounts}
            categories={categories}
          />
          <DeleteTransactionDialog
            transactionId={transaction.id}
            amount={transaction.amount}
            date={transaction.date}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
