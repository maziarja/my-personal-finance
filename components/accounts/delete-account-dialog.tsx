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

interface DeleteAccountDialogProps {
  accountId: string;
  accountName: string;
}

export function DeleteAccountDialog({ accountId, accountName }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);

  function handleDelete() {
    // user wires deleteFinancialAccount server action here
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete account"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong className="font-medium text-foreground">{accountName}</strong>? This
            action cannot be undone.
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
