type TransactionFilters = {
  accountId?: string;
  categoryId?: string;
  type?: string;
  from?: string;
  to?: string;
};

export const transactionKeys = {
  all: () => ["transactions"] as const,
  list: (filters: TransactionFilters = {}) => ["transactions", filters] as const,
};
