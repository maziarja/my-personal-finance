"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/_actions/authActions";

export function SignOutButton() {
  return (
    <Button
      onClick={signOut}
      variant="ghost"
      size="sm"
      className="text-muted-foreground gap-2"
    >
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}
