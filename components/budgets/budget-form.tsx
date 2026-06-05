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
  budgetFormSchema,
  type BudgetFormType,
} from "@/lib/schemas/budgetSchema";
import type { BudgetCategory } from "@/components/budgets/budget-card";
import { CategoryOption } from "../transactions/transaction-form";

interface BudgetFormProps {
  id: string;
  categories: BudgetCategory[];
  defaultValues?: Partial<BudgetFormType>;
  onSubmit: (
    data: BudgetFormType,
    category: CategoryOption,
  ) => Promise<void | { error: string }>;
}

export function BudgetForm({
  id,
  categories,
  defaultValues,
  onSubmit,
}: BudgetFormProps) {
  const form = useForm<BudgetFormType>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: defaultValues?.categoryId ?? "",
      monthlyLimit: defaultValues?.monthlyLimit ?? "",
      month: defaultValues?.month ?? "",
    },
  });

  async function handleSubmit(data: BudgetFormType) {
    const category = categories.find((cat) => cat.id === data.categoryId);
    if (category) {
      const result = await onSubmit(data, category);
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
                    "flex flex-1 items-center gap-2 text-left text-sm",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    <>
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            categories.find((c) => c.id === field.value)
                              ?.color ?? "#94a3b8",
                        }}
                      />
                      {categories.find((c) => c.id === field.value)?.name}
                    </>
                  ) : (
                    "Select a category"
                  )}
                </span>
              </SelectTrigger>
              <SelectContent>
                {categories.map(({ id: catId, name, color }) => (
                  <SelectItem key={catId} value={catId}>
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {name}
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

      <Controller
        control={form.control}
        name="monthlyLimit"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">
              Monthly limit
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

      <Controller
        control={form.control}
        name="month"
        render={({ field, fieldState }) => (
          <Field.Root
            invalid={!!fieldState.error}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className="text-sm font-medium">Month</Field.Label>
            <Input type="month" {...field} />
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
