"use client";

import Link from "next/link";
import { ReceiptText, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/components/transactions/transaction-table";
import { TransactionStatus } from "@/app/generated/prisma/enums";
import { TransactionsError } from "../transactions/transactions-error";

type RecentTransactionsProps = {
  transactions: Transaction[] | { error: string } | undefined;
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!Array.isArray(transactions)) return <TransactionsError />;

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-10 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <ReceiptText className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="font-medium">No transactions yet</p>
          <p className="text-muted-foreground text-sm">
            Log your first income or expense to see it here.
          </p>
        </div>
        <Link
          href="/transactions"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5",
          )}
        >
          Log a transaction <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const formattedDate =
              typeof transaction.date === "string"
                ? new Date(transaction.date).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })
                : transaction.date.toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  });

            const formattedAmount = Number(transaction.amount).toLocaleString(
              "en-US",
              { style: "currency", currency: "USD" },
            );

            return (
              <TableRow key={transaction.id}>
                <TableCell className="text-muted-foreground">
                  {formattedDate}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {transaction.status !== TransactionStatus.CANCELED &&
                      transaction.status !== TransactionStatus.REJECTED && (
                        <Badge
                          className={cn(
                            transaction.type === "INCOME"
                              ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
                          )}
                        >
                          {transaction.type === "INCOME" ? "Income" : "Expense"}
                        </Badge>
                      )}
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
                  {transaction.category ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: transaction.category.color }}
                      />
                      <span>{transaction.category.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
