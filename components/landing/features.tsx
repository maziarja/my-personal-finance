import { LayoutList, PiggyBank, Target, CreditCard } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

const features = [
  {
    icon: LayoutList,
    title: "Transactions",
    description:
      "Log every expense and income in one place. Categorize, filter, and search across all your financial activity.",
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
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Everything you need
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Built around the four pillars of personal finance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
