"use client";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/_actions/categoryActions";
import { Category } from "@/components/categories/category-card";
import {
  CategoryFormType,
  UpdatedCategoryFormType,
} from "@/lib/schemas/categorySchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryKey } from "@/lib/query-keys/categories";

export function useCategoryMutations() {
  //// Create
  const { mutate: create } = useMutation({
    mutationFn: (data: CategoryFormType) => createCategory(data),
    onMutate: async (newCategory, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: categoryKey.all() });
      // Snapshot prev cat
      const previousCategories = context.client.getQueryData<Category[]>(
        categoryKey.list(),
      );
      // Set optimistic cat
      const optimisticCategory: Category = {
        id: crypto.randomUUID(),
        ...newCategory,
      };
      context.client.setQueryData<Category[]>(categoryKey.list(), (old = []) =>
        [...old, optimisticCategory].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return { previousCategories };
    },

    // Role back on error
    onError: (err, _newCategory, onMutateResult, context) => {
      context.client.setQueryData(
        categoryKey.list(),
        onMutateResult?.previousCategories,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: categoryKey.all() });
    },
  });

  //// Update
  const { mutate: update } = useMutation({
    mutationFn: (updatedCategory: UpdatedCategoryFormType) =>
      updateCategory(updatedCategory),

    onMutate: async (newCategory, context) => {
      // Cancel Querying
      await context.client.cancelQueries({ queryKey: categoryKey.all() });
      // Snapshot previous cat
      const previousCategories = context.client.getQueryData<Category[]>(
        categoryKey.list(),
      );
      // Set optimistic cat
      context.client.setQueryData<Category[]>(categoryKey.list(), (old = []) =>
        old
          .map((o) => {
            return o.id === newCategory.id
              ? {
                  ...o,
                  ...newCategory,
                }
              : o;
          })
          .sort((a, b) => a.name.localeCompare(b.name)),
      );

      return { previousCategories };
    },

    // Role back on error
    onError: (err, _updatedCategory, onMutateResult, context) => {
      context.client.setQueryData(
        categoryKey.list(),
        onMutateResult?.previousCategories,
      );
      toast.error(err.message);
    },

    onSettled: (data, _error, _updatedCategory, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: categoryKey.all() });
    },
  });

  //// Delete
  const { mutate: remove } = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onMutate: async (newId, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: categoryKey.all() });
      // Snapshot previous cat
      const previousCategories = context.client.getQueryData<Category[]>(
        categoryKey.list(),
      );
      // Set optimistic cat
      context.client.setQueryData<Category[]>(categoryKey.list(), (old = []) =>
        old.filter((o) => o.id !== newId),
      );
      return { previousCategories };
    },

    // Role back on error
    onError: (err, _categoryId, onMutateResult, context) => {
      context.client.setQueryData(
        categoryKey.list(),
        onMutateResult?.previousCategories,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _categoryId, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: categoryKey.all() });
    },
  });

  return { create, update, remove };
}
