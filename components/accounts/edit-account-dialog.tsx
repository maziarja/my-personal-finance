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
import { AccountForm } from "@/components/accounts/account-form";
import { type AccountFormType } from "@/lib/schemas/accountSchema";
import { type Account } from "@/components/accounts/account-card";

interface EditAccountDialogProps {
  account: Account;
}

export function EditAccountDialog({ account }: EditAccountDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: AccountFormType): Promise<void | { error: string }> {
    // user wires updateFinancialAccount server action here
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit account"
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit account</DialogTitle>
          </DialogHeader>
          <AccountForm
            id="edit-account-form"
            defaultValues={{
              name: account.name,
              type: account.type,
              balance: String(account.balance),
            }}
            balanceLabel="Current balance"
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit" form="edit-account-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
