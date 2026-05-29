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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TransactionForm } from "@/components/transactions/transaction-form";
import type {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import { type TransactionFormType } from "@/lib/schemas/transactionSchema";
import { useTransactionMutations } from "@/hooks/useTransactionMutations";

interface CreateTransactionDialogProps {
  accounts: AccountOption[] | undefined;
  categories: CategoryOption[] | undefined;
}

function getBlockReason(
  accounts: AccountOption[] | undefined,
  categories: CategoryOption[] | undefined,
): string | null {
  const noAccounts = !accounts || accounts.length === 0;
  const noCategories = !categories || categories.length === 0;
  if (noAccounts && noCategories)
    return "Add at least one account and one category first";
  if (noAccounts) return "Add at least one account first";
  if (noCategories) return "Add at least one category first";
  return null;
}

export function CreateTransactionDialog({
  accounts,
  categories,
}: CreateTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const blockReason = getBlockReason(accounts, categories);
  const { create } = useTransactionMutations();

  async function handleSubmit(
    data: TransactionFormType,
    account: AccountOption,
    category: CategoryOption,
  ): Promise<void | { error: string }> {
    setOpen(false);
    create({ data, account, category });
  }

  if (blockReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={<span tabIndex={0} className="inline-flex" />}
          >
            <Button size="sm" disabled>
              <Plus className="size-4" />
              Add transaction
            </Button>
          </TooltipTrigger>
          <TooltipContent>{blockReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
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
            accounts={accounts!}
            categories={categories!}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="create-transaction-form">
              Add transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
