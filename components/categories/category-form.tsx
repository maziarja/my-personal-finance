"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@base-ui/react/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  categoryFormSchema,
  type CategoryFormType,
} from "@/lib/schemas/categorySchema";

const CATEGORY_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#64748b",
  "#6b7280",
  "#78716c",
] as const;

interface CategoryFormProps {
  id: string;
  defaultValues?: Partial<CategoryFormType>;
  onSubmit: (data: CategoryFormType) => Promise<void | { error: string }>;
}

export function CategoryForm({
  id,
  defaultValues,
  onSubmit,
}: CategoryFormProps) {
  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      color: defaultValues?.color ?? CATEGORY_COLORS[7],
    },
  });

  async function handleSubmit(data: CategoryFormType) {
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
              Category name
            </Field.Label>
            <Input placeholder="e.g. Groceries" {...field} />
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
        name="color"
        render={({ field, fieldState }) => (
          <fieldset className="flex flex-col gap-1.5 border-0 m-0 p-0">
            <legend className="text-sm font-medium mb-1.5">Color</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => field.onChange(color)}
                  className={cn(
                    "size-7 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    field.value === color
                      ? "ring-foreground scale-110 ring-2 ring-offset-2"
                      : "hover:scale-105",
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                  aria-pressed={field.value === color}
                />
              ))}
            </div>
            {fieldState.error && (
              <p className="text-destructive text-sm">
                {fieldState.error.message}
              </p>
            )}
          </fieldset>
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
