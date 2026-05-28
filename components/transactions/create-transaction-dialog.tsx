"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import type { AccountOption, CategoryOption } from "@/components/transactions/transaction-form";
import { type TransactionFormType } from "@/lib/schemas/transactionSchema";

interface CreateTransactionDialogProps {
  accounts: AccountOption[];
  categories: CategoryOption[];
}

export function CreateTransactionDialog({
  accounts,
  categories,
}: CreateTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(
    _data: TransactionFormType,
  ): Promise<void | { error: string }> {
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="size-4" />
        Add transaction
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            id="create-transaction-form"
            accounts={accounts}
            categories={categories}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit" form="create-transaction-form">
              Add transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
