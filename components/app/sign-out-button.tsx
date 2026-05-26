"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/_actions/authActions";
import { useTransition } from "react";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  function signOutUser() {
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <Button
      onClick={signOutUser}
      variant="ghost"
      size="sm"
      disabled={isPending}
      className="text-muted-foreground gap-2"
    >
      <LogOut className="size-4" />
      {"Sign out"}
    </Button>
  );
}
