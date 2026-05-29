"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@base-ui/react/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  transactionFormSchema,
  type TransactionFormType,
} from "@/lib/schemas/transactionSchema";
import { AccountType } from "@/app/generated/prisma/enums";

export type AccountOption = { id: string; name: string; type: AccountType };
export type CategoryOption = { id: string; name: string; color: string };

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: "Checking",
  SAVING: "Saving",
  CREDIT_CARD: "Credit Card",
  CASH: "Cash",
};

const TRANSACTION_TYPES = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
] as const;

type TransactionFormProps = {
  id: string;
  defaultValues?: Partial<TransactionFormType>;
  accounts: AccountOption[];
  categories: CategoryOption[];
  onSubmit: (
    data: TransactionFormType,
    account: AccountOption,
    category: CategoryOption,
  ) => Promise<void | { error: string }>;
};

export function TransactionForm({
  id,
  defaultValues,
  accounts,
  categories,
  onSubmit,
}: TransactionFormProps) {
  const form = useForm<TransactionFormType>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: defaultValues?.amount ?? "",
      type: defaultValues?.type,
      categoryId: defaultValues?.categoryId ?? "",
      financialAccountId: defaultValues?.financialAccountId ?? "",
      date: defaultValues?.date ?? new Date().toISOString().split("T")[0],
      notes: defaultValues?.notes ?? "",
    },
  });

  async function handleSubmit(data: TransactionFormType) {
    const account = accounts.find(
      (acc) => acc.id === form.getValues("financialAccountId"),
    );
    const category = categories.find(
      (cat) => cat.id === form.getValues("categoryId"),
    );
    if (account && category) {
      const result = await onSubmit(data, account, category);
      if (result?.error) {
        form.setError("root", { message: result.error });
      }
    }
  }

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field.Root
              invalid={!!fieldState.error}
              className="flex flex-col gap-1.5"
            >
              <Field.Label className="text-sm font-medium">Amount</Field.Label>
              <Input placeholder="0.00" {...field} />
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
          name="type"
          render={({ field, fieldState }) => (
            <Field.Root
              invalid={!!fieldState.error}
              className="flex flex-col gap-1.5"
            >
              <Field.Label className="text-sm font-medium">Type</Field.Label>
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
                      ? TRANSACTION_TYPES.find((t) => t.value === field.value)
                          ?.label
                      : "Select type"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
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
      </div>

      <Controller
        control={form.control}
        name="categoryId"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">Category</Field.Label>
            <Select value={field.value ?? null} onValueChange={field.onChange}>
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
                {categories.map((category) => {
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 shrink-0 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  );
                })}
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
        name="financialAccountId"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">Account</Field.Label>
            <Select value={field.value ?? null} onValueChange={field.onChange}>
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
                      · {ACCOUNT_TYPE_LABELS[account.type] ?? account.type}
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
        name="date"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">Date</Field.Label>
            <Input type="date" {...field} />
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
        name="notes"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Field.Label>
            <Input placeholder="Add a note..." {...field} />
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
  );
}
