"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@base-ui/react/field";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  acceptTransactionSchema,
  type AcceptTransactionFormType,
} from "@/lib/schemas/transactionSchema";
import type {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import type { Transaction } from "@/components/transactions/transaction-table";
import { useTransactionMutations } from "@/hooks/useTransactionMutations";

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: "Checking",
  SAVING: "Saving",
  CREDIT_CARD: "Credit Card",
  CASH: "Cash",
};

type AcceptTransactionDialogProps = {
  transaction: Transaction;
  accounts: AccountOption[];
  categories: CategoryOption[];
};

export function AcceptTransactionDialog({
  transaction,
  accounts,
  categories,
}: AcceptTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { accept } = useTransactionMutations();

  const form = useForm<AcceptTransactionFormType>({
    resolver: zodResolver(acceptTransactionSchema),
    defaultValues: {
      financialAccountId: "",
      categoryId: "",
    },
  });

  const formattedAmount = Number(transaction.amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  async function handleSubmit(data: AcceptTransactionFormType) {
    setOpen(false);
    const financialAccount = accounts.find(
      (acc) => acc.id === data.financialAccountId,
    );
    const category = categories.find((cat) => cat.id === data.categoryId);
    const transactionId = transaction.id;
    if (financialAccount && category) {
      const dataWithId = { ...data, transactionId };
      accept({ dataWithId, financialAccount, category });
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Accept transfer"
        onClick={() => setOpen(true)}
      >
        <CheckCheck className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept transfer</DialogTitle>
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

          <form
            id="accept-transaction-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              control={form.control}
              name="financialAccountId"
              render={({ field, fieldState }) => (
                <Field.Root
                  invalid={!!fieldState.error}
                  className="flex flex-col gap-1.5"
                >
                  <Field.Label className="text-sm font-medium">
                    Account
                  </Field.Label>
                  <Select
                    value={field.value ?? null}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <span
                        className={cn(
                          "flex flex-1 text-left text-sm",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? (() => {
                              const a = accounts.find(
                                (acc) => acc.id === field.value,
                              );
                              return a ? (
                                <>
                                  {a.name}
                                  <span className="text-muted-foreground ml-1">
                                    · {ACCOUNT_TYPE_LABELS[a.type] ?? a.type}
                                  </span>
                                </>
                              ) : null;
                            })()
                          : "Select account"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                          <span className="text-muted-foreground ml-1">
                            ·{" "}
                            {ACCOUNT_TYPE_LABELS[account.type] ?? account.type}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field.Root>
              )}
            />

            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field.Root
                  invalid={!!fieldState.error}
                  className="flex flex-col gap-1.5"
                >
                  <Field.Label className="text-sm font-medium">
                    Category
                  </Field.Label>
                  <Select
                    value={field.value ?? null}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <span
                        className={cn(
                          "flex flex-1 text-left text-sm",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? categories.find((c) => c.id === field.value)?.name
                          : "Select category"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="size-3 shrink-0 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field.Root>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>

          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="accept-transaction-form">
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
