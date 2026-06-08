import { TransactionType } from "@/app/generated/prisma/enums";

type TransactionFilters = {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  from?: string;
  to?: string;
};

export const transactionKeys = {
  all: () => ["transactions"] as const,
  list: (filters: TransactionFilters = {}) =>
    ["transactions", "list", filters] as const,
  recent: (limit: number) => ["transactions", "recent", limit] as const,
};
