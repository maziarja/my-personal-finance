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
import { CategoryForm } from "@/components/categories/category-form";
import { type CategoryFormType } from "@/lib/schemas/categorySchema";

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(
    _data: CategoryFormType,
  ): Promise<void | { error: string }> {
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="size-4" />
        Add category
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
          </DialogHeader>
          <CategoryForm id="create-category-form" onSubmit={handleSubmit} />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="create-category-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
