import { getSession } from "@/lib/helpers/getSession";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/app-sidebar";
import { Header } from "@/components/app/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header
          userName={session.user.name}
          userEmail={session.user.email}
        />
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
