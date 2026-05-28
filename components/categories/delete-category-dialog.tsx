"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useCategoryMutations } from "@/hooks/useCategoryMutations";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryDialog({
  categoryId: categoryId,
  categoryName,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { remove } = useCategoryMutations();
  function handleDelete() {
    setOpen(false);
    remove(categoryId);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete category"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete{" "}
            <strong className="text-foreground font-medium">
              {categoryName}
            </strong>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
