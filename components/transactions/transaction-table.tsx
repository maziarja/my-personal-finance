"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  NotebookPen,
  MinusIcon,
} from "lucide-react";
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
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import { AcceptTransactionDialog } from "@/components/transactions/accept-transaction-dialog";
import { CancelTransactionDialog } from "@/components/transactions/cancel-transaction-dialog";
import { RejectTransactionDialog } from "@/components/transactions/reject-transaction-dialog";
import type {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import {
  AccountType,
  TransactionStatus,
  TransactionType,
} from "@/app/generated/prisma/enums";

export type Transaction = {
  id: string;
  amount: string | number;
  type?: TransactionType;
  status?: TransactionStatus | null;
  date: string | Date;
  notes?: string | null;
  from?: string | null;
  to?: string | null;
  category?: { id: string; name: string; color: string } | null;
  financialAccount?: { id: string; name: string; type: AccountType } | null;
};

type SortColumn =
  | "date"
  | "amount"
  | "type"
  | "category"
  | "account"
  | "from"
  | "to";
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
  { key: "from", label: "From" },
  { key: "to", label: "To" },
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
      ? new Date(transaction.date).toLocaleDateString("en-US", {
          timeZone: "UTC",
        })
      : transaction.date.toLocaleDateString("en-US", { timeZone: "UTC" });

  const formattedAmount = Number(transaction.amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const isReceiver = transaction.from;
  const isSender = transaction.to;

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{formattedDate}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Badge
            className={cn(
              transaction.type === "INCOME"
                ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {transaction.type === "INCOME" ? "Income" : "Expense"}
          </Badge>
          {transaction.status === TransactionStatus.PENDING && (
            <Badge className="border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              Pending
            </Badge>
          )}
          {transaction.status === TransactionStatus.CANCELED && (
            <Badge className="border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
              Cancelled
            </Badge>
          )}
          {transaction.status === TransactionStatus.REJECTED && (
            <Badge className="border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
              Rejected
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {transaction.category ? (
            <>
              <div
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: transaction.category.color }}
              />
              <span>{transaction.category.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
          {transaction.notes && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={<span className="inline-flex" tabIndex={0} />}
                >
                  <NotebookPen className="text-muted-foreground size-3.5 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>{transaction.notes}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {transaction.financialAccount?.name ?? "—"}
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

      <TableCell className="text-muted-foreground">
        {isReceiver ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={<span className="inline-flex" tabIndex={0} />}
                >
                  {transaction.from?.split("@")[0].slice(0, 10)}
                </TooltipTrigger>
                <TooltipContent>{transaction.from}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <MinusIcon className="text-muted-foreground ml-2" />
        )}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {isSender ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={<span className="inline-flex" tabIndex={0} />}
                >
                  {transaction.to?.split("@")[0].slice(0, 10)}
                </TooltipTrigger>
                <TooltipContent>{transaction.to}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <MinusIcon className="text-muted-foreground" />
        )}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1">
          {isReceiver && transaction.status === TransactionStatus.PENDING ? (
            <>
              <AcceptTransactionDialog
                transaction={transaction}
                accounts={accounts}
                categories={categories}
              />
              <RejectTransactionDialog transaction={transaction} />
            </>
          ) : isSender && transaction.status === TransactionStatus.PENDING ? (
            <CancelTransactionDialog transaction={transaction} />
          ) : !isReceiver && !isSender ? (
            <DeleteTransactionDialog
              transactionId={transaction.id}
              amount={transaction.amount}
              date={transaction.date}
            />
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}
