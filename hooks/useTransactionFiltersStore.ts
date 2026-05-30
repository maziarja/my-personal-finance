import { TransactionType } from "@/app/generated/prisma/enums";
import { create } from "zustand";

export type TransactionFilters = {
  accountId: string | null;
  categoryId: string | null;
  type: TransactionType | null | string;
  from: string;
  to: string;
};

type TransactionFilterStore = TransactionFilters & {
  setAccountId: (v: string | null) => void;
  setCategoryId: (v: string | null) => void;
  setType: (v: TransactionType | null | string) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
};

const initialState: TransactionFilters = {
  accountId: null,
  categoryId: null,
  type: null,
  from: "",
  to: "",
};

export const useTransactionFiltersStore = create<TransactionFilterStore>(
  (set) => ({
    ...initialState,
    setAccountId: (v) => set({ accountId: v }),
    setCategoryId: (v) => set({ categoryId: v }),
    setType: (v) => set({ type: v }),
    setFrom: (v) => set({ from: v }),
    setTo: (v) => set({ to: v }),
  }),
);
