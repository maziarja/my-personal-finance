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
  accountFormSchema,
  type AccountFormType,
} from "@/lib/schemas/accountSchema";

const ACCOUNT_TYPES = [
  { value: "CHECKING", label: "Checking" },
  { value: "SAVING", label: "Saving" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "CASH", label: "Cash" },
] as const;

interface AccountFormProps {
  id: string;
  defaultValues?: Partial<AccountFormType>;
  onSubmit: (data: AccountFormType) => Promise<void | { error: string }>;
  balanceLabel?: string;
}

export function AccountForm({
  id,
  defaultValues,
  onSubmit,
  balanceLabel = "Opening balance",
}: AccountFormProps) {
  const form = useForm<AccountFormType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type,
      balance: defaultValues?.balance ?? "",
    },
  });

  async function handleSubmit(data: AccountFormType) {
    const result = await onSubmit(data);
    if (result?.error) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">
              Account name
            </Field.Label>
            <Input placeholder="e.g. Chase Checking" {...field} />
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
            <Field.Label className="text-sm font-medium">
              Account type
            </Field.Label>
            <Select value={field.value ?? null} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <span
                  className={cn(
                    "flex flex-1 text-left text-sm",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? ACCOUNT_TYPES.find((t) => t.value === field.value)?.label
                    : "Select a type"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map(({ value, label }) => (
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

      <Controller
        control={form.control}
        name="balance"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">
              {balanceLabel}
            </Field.Label>
            <Input placeholder="0.00" {...field} />
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
