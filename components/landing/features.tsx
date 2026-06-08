import { LayoutList, PiggyBank, Target, CreditCard, Send } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

const features = [
  {
    icon: LayoutList,
    title: "Transactions",
    description:
      "Log every expense and income in one place. Categorize, filter, and search across all your financial activity.",
  },
  {
    icon: Send,
    title: "P2P Transfers",
    description:
      "Send money to other users by email. Recipients accept or decline — balances only update on acceptance.",
  },
  {
    icon: PiggyBank,
    title: "Budgets",
    description:
      "Set monthly spending limits by category and get a clear view of where your money is going before it's gone.",
  },
  {
    icon: Target,
    title: "Goals",
    description:
      "Define savings targets — a holiday, an emergency fund, a home — and track your progress milestone by milestone.",
  },
  {
    icon: CreditCard,
    title: "Accounts",
    description:
      "Organize all your bank accounts, credit cards, and wallets in a single unified overview.",
  },
];

export function Features() {
  return (
    <section className="border-border bg-muted/30 border-t">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Everything you need to take control of your finances.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureCard
                icon={<Icon className="size-5" aria-hidden="true" />}
                title={title}
                description={description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
