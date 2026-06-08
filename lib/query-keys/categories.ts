export const categoryKey = {
  all: () => ["categories"] as const,
  list: () => ["categories", "list"] as const,
  spendingData: () => ["categories", "list", "spendingData"] as const,
};
