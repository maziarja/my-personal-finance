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
import { CategoryForm } from "@/components/categories/category-form";
import { type CategoryFormType } from "@/lib/schemas/categorySchema";
import { type Category } from "@/components/categories/category-card";

type EditCategoryDialogProps = {
  category: Category;
};

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(
    _data: CategoryFormType,
  ): Promise<void | { error: string }> {
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit category"
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            id="edit-category-form"
            defaultValues={{
              name: category.name,
              color: category.color,
            }}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="edit-category-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
