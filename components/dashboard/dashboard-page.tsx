"use client";

import { AccountsSummary } from "@/components/dashboard/accounts-summary";
import { BudgetProgressSection } from "@/components/dashboard/budget-progress-section";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { useQuery } from "@tanstack/react-query";
import { accountKey } from "@/lib/query-keys/accounts";
import { getAccounts } from "@/app/_actions/accountActions";
import { transactionKeys } from "@/lib/query-keys/transactions";
import { getTransactions } from "@/app/_actions/transactionActions";
import { categoryKey } from "@/lib/query-keys/categories";
import { getCategories, getSpendingData } from "@/app/_actions/categoryActions";
import { budgetKey } from "@/lib/query-keys/budgets";
import { getBudgets } from "@/app/_actions/budgetActions";
import { RECENT_TRANSACTION_NUM } from "@/lib/const";

export function DashboardPage() {
  const { data: accounts } = useQuery({
    queryKey: accountKey.list(),
    queryFn: getAccounts,
  });

  const { data: recentTransactions } = useQuery({
    queryKey: transactionKeys.recent(RECENT_TRANSACTION_NUM),
    queryFn: () => getTransactions({}, RECENT_TRANSACTION_NUM),
  });

  const { data: categories } = useQuery({
    queryKey: categoryKey.list(),
    queryFn: getCategories,
  });

  const { data: budgets } = useQuery({
    queryKey: budgetKey.list(),
    queryFn: getBudgets,
  });

  const { data: spendingData } = useQuery({
    queryKey: categoryKey.spendingData(),
    queryFn: getSpendingData,
  });

  if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
    return <DashboardEmpty />;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Accounts
        </h2>
        <AccountsSummary accounts={accounts} />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Spending Overview
          </CardTitle>
          <CardDescription>
            This month vs last month by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingChart data={spendingData} />
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Budget Progress
        </h2>
        <BudgetProgressSection budgets={budgets} categories={categories} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Recent Transactions
        </h2>
        <RecentTransactions transactions={recentTransactions} />
      </section>
    </div>
  );
}
