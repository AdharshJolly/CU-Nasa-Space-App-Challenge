"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult();
        const userRole = idTokenResult.claims.role;

        if (userRole === "admin" || userRole === "superadmin") {
          router.push("/admin/dashboard");
        } else {
          toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have access to the admin dashboard.",
          });
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [router, toast]);

  // Show a skeleton loader while redirecting
  return <DashboardSkeleton />;
}
