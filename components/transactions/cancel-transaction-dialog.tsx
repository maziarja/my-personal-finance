"use client";

import { useState } from "react";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useTransactionMutations } from "@/hooks/useTransactionMutations";
import type { Transaction } from "@/components/transactions/transaction-table";

interface CancelTransactionDialogProps {
  transaction: Transaction;
}

export function CancelTransactionDialog({
  transaction,
}: CancelTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { cancel } = useTransactionMutations();

  const formattedAmount = Number(transaction.amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  async function handleCancel() {
    setOpen(false);
    cancel(transaction.id);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Cancel transfer"
        onClick={() => setOpen(true)}
      >
        <CircleX className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel transfer</DialogTitle>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{transaction.to}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                -{formattedAmount}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            The transfer hasn&apos;t been accepted yet. Cancelling it will
            remove the pending request and no balance changes will occur.
          </p>

          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Keep</DialogClose>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
