import { getAccounts } from "@/app/_actions/accountActions";
import { accountKey } from "@/lib/query-keys/accounts";
import { AccountList } from "@/components/accounts/account-list";
import { getQueryClient } from "@/lib/helpers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function AccountsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: accountKey.list(),
    queryFn: getAccounts,
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="border-l-2 border-brand/45 pl-3">
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <p className="text-muted-foreground text-sm">
          Manage your financial accounts
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AccountList />
      </HydrationBoundary>
    </div>
  );
}
