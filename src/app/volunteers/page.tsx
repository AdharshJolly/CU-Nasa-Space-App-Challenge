"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logAuth } from "@/lib/logger";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { LogOut, HandHelping } from "lucide-react";

function VolunteersContent() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const userEmail = user?.email;
    await signOut(auth);
    if (userEmail) {
      await logAuth(userEmail, "logout");
    }
    router.push("/login");
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background bg-grid-pattern p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex justify-center items-center mb-4">
            <HandHelping className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">
            Volunteers Portal
          </CardTitle>
          <CardDescription>Welcome, {user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is the placeholder page for the Volunteers Dashboard.</p>
          <p className="text-muted-foreground">
            Further functionalities and specific tools for volunteers will be
            implemented here.
          </p>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2" /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VolunteersPage() {
  return (
    <ProtectedRoute allowedRoles={["volunteer", "poc"]} pagePath="/volunteers">
      <VolunteersContent />
    </ProtectedRoute>
  );
}
