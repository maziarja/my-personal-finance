"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface DeleteTransactionDialogProps {
  transactionId: string;
  amount: string | number;
  date: string | Date;
}

export function DeleteTransactionDialog({
  transactionId: _transactionId,
  amount,
  date,
}: DeleteTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const formattedDate =
    typeof date === "string"
      ? new Date(date).toLocaleDateString()
      : date.toLocaleDateString();

  function handleDelete() {
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete transaction"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete transaction</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete the{" "}
            <strong className="text-foreground font-medium">${amount}</strong>{" "}
            transaction on{" "}
            <strong className="text-foreground font-medium">
              {formattedDate}
            </strong>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
