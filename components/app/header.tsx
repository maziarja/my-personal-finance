import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/app/sign-out-button";
import { ThemeToggle } from "@/components/app/theme-toggle";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface HeaderProps {
  userName: string;
  userEmail: string;
}

export function Header({ userName, userEmail }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="my-auto h-4" />
      <div className="flex flex-1 items-center justify-end gap-3">
        <span className="text-muted-foreground hidden text-sm sm:block">
          {userEmail}
        </span>
        <ThemeToggle />
        <Avatar size="sm" className="ring-1 ring-brand/[0.3] ring-offset-1 ring-offset-background">
          <AvatarFallback>{getInitials(userName)}</AvatarFallback>
        </Avatar>
        <SignOutButton />
      </div>
    </header>
  );
}
