"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";
import type {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import { type TransactionFormType } from "@/lib/schemas/transactionSchema";
import type { Transaction } from "@/components/transactions/transaction-table";
import { useTransactionMutations } from "@/hooks/useTransactionMutations";

interface EditTransactionDialogProps {
  transaction: Transaction;
  accounts: AccountOption[];
  categories: CategoryOption[];
}

export function EditTransactionDialog({
  transaction,
  accounts,
  categories,
}: EditTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { update } = useTransactionMutations();
  async function handleSubmit(
    data: TransactionFormType,
    account: AccountOption,
    category: CategoryOption,
  ): Promise<void | { error: string }> {
    setOpen(false);
    const id = transaction.id;
    const updatedTransaction = { ...data, id };
    update({ updatedTransaction, category, account });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit transaction"
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            id="edit-transaction-form"
            defaultValues={{
              amount: String(transaction.amount),
              type: transaction.type,
              categoryId: transaction.category.id,
              financialAccountId: transaction.financialAccount.id,
              date:
                typeof transaction.date === "string"
                  ? transaction.date.split("T")[0]
                  : transaction.date.toISOString().split("T")[0],
              notes: transaction.notes ?? "",
            }}
            accounts={accounts}
            categories={categories}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="edit-transaction-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
