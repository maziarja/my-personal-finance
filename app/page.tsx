import Link from "next/link";
import { LayoutList, PiggyBank, Target, CreditCard, TrendingUp } from "lucide-react";
import { getSession } from "@/lib/helpers/getSession";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: LayoutList,
    title: "Transactions",
    description:
      "Log every expense and income in one place. Categorise, filter, and search across all your financial activity.",
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
      "Organise all your bank accounts, credit cards, and wallets in a single unified overview.",
  },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <TrendingUp className="size-5" aria-hidden="true" />
          <span>Finio</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32">
      <div className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        Personal finance, simplified
      </div>

      <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
        Your money,{" "}
        <br className="hidden sm:block" />
        clearly in view
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
        Finio brings your accounts, budgets, transactions, and savings goals
        together in one calm, distraction-free space — so you always know
        where you stand.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        >
          Get started free
        </Link>
        <Link
          href="/sign-in"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}

function Features() {
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
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="gap-3 py-5">
              <CardHeader className="pb-0">
                <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                  <Icon className="size-4 text-foreground" aria-hidden="true" />
                </div>
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[0.8125rem] leading-relaxed">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
        &copy; {new Date().getFullYear()} Finio. Built for clarity.
      </div>
    </footer>
  );
}

async function Page() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default Page;
