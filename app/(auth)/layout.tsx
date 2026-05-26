export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh flex items-center justify-center bg-muted/40 px-4 py-12">
      {children}
    </main>
  );
}
