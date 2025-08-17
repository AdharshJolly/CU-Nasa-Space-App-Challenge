
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, LogOut, HandHelping } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VolunteersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            const idTokenResult = await currentUser.getIdTokenResult();
            const userRole = idTokenResult.claims.role;

            if (userRole === 'volunteer' || userRole === 'poc') {
                setUser(currentUser);
            } else {
                toast({
                    variant: "destructive",
                    title: "Permission Denied",
                    description: "You do not have access to this page.",
                });
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
        setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, [router, toast]);
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };
  
  if (isLoading || !user) {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background bg-grid-pattern p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }


  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background bg-grid-pattern p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex justify-center items-center mb-4">
            <HandHelping className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Volunteer & POC Portal</CardTitle>
          <CardDescription>Welcome, {user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is the placeholder page for the Volunteer & POC Dashboard.</p>
          <p className="text-muted-foreground">
            Tasks, schedules, and communication tools for volunteers and Points of Contact will be available here.
          </p>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2" /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
