import { AccountList } from "@/components/accounts/account-list";

export default async function AccountsPage() {
  // user fetches accounts here and replaces the empty array
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <p className="text-sm text-muted-foreground">Manage your financial accounts</p>
      </div>
      <AccountList accounts={[]} />
    </div>
  );
}
