import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { buttonVariants } from "@/lib/variants/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <TrendingUp className="size-5 text-brand" aria-hidden="true" />
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
