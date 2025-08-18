"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { logPageAccess } from "@/lib/logger";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
  pagePath: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/login",
  pagePath,
}: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (userRole && !allowedRoles.includes(userRole)) {
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You do not have access to this page.",
        });
        router.push("/login");
        return;
      }

      // Log page access for authenticated users (fire and forget)
      if (user && userRole) {
        // Don't await this - log asynchronously
        logPageAccess(user.email, pagePath, userRole).catch(console.error);
      }
    }
  }, [
    user,
    userRole,
    loading,
    router,
    allowedRoles,
    redirectTo,
    pagePath,
    toast,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background bg-grid-pattern p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (userRole && !allowedRoles.includes(userRole))) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
};
