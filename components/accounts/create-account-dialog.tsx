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
import { AccountForm } from "@/components/accounts/account-form";
import { type AccountFormType } from "@/lib/schemas/accountSchema";

export function CreateAccountDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(_data: AccountFormType): Promise<void | { error: string }> {
    // user wires createFinancialAccount server action here
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="size-4" />
        Add account
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add account</DialogTitle>
          </DialogHeader>
          <AccountForm
            id="create-account-form"
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit" form="create-account-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
