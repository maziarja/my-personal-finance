export function Footer() {
  return (
    <footer className="border-t border-border">
      <div suppressHydrationWarning className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
        &copy; {new Date().getFullYear()} Finio. Built for clarity.
      </div>
    </footer>
  );
}
