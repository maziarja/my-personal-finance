import { AccountListSkeleton } from "@/components/accounts/account-list-skeleton";

export default function AccountsLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <p className="text-muted-foreground text-sm">
          Manage your financial accounts
        </p>
      </div>
      <AccountListSkeleton />
    </div>
  );
}
