export const budgetKey = {
  all: () => ["budgets"] as const,
  list: () => ["budgets", "list"] as const,
};
