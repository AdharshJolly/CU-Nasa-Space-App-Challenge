
"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Rocket } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Rocket className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl md:text-2xl font-bold text-foreground">
            Admin Dashboard
          </span>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
