"use client";

import { useState } from "react";
import { X } from "lucide-react";
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

interface RejectTransactionDialogProps {
  transaction: Transaction;
}

export function RejectTransactionDialog({
  transaction,
}: RejectTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { reject } = useTransactionMutations();

  const formattedAmount = Number(transaction.amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  async function handleReject() {
    setOpen(false);
    reject(transaction.id);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Reject transfer"
        onClick={() => setOpen(true)}
      >
        <X className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject transfer</DialogTitle>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium">{transaction.from}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                +{formattedAmount}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            No balance changes will occur if you reject this transfer.
          </p>

          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Keep</DialogClose>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
