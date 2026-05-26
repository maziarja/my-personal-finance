import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
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
