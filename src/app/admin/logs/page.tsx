
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BookText, Loader2 } from "lucide-react";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";

interface Log {
  id: string;
  action: string;
  details: { [key: string]: any };
  userEmail: string;
  timestamp: Timestamp;
}

export default function AdminLogs() {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const superAdminEmails = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "")
          .split(',')
          .map(email => email.trim());
        const isAdmin = currentUser.email ? superAdminEmails.includes(currentUser.email) : false;
        
        if (isAdmin) {
          setIsSuperAdmin(true);
        } else {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have permission to view this page.",
          });
          router.push("/admin/dashboard");
        }
      } else {
        router.push("/admin");
      }
    });

    return () => unsubscribeAuth();
  }, [router, toast]);


  useEffect(() => {
    if (!isSuperAdmin) {
        setIsLoading(false);
        return;
    }

    const logsQuery = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const logsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Log[];
      setLogs(logsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching logs:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch activity logs.",
        });
        setIsLoading(false);
    });

    return () => unsubscribeLogs();
  }, [isSuperAdmin, toast]);


  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  if (!isSuperAdmin) {
    // This is a fallback, user should be redirected by the auth effect
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
             <p>Redirecting...</p>
        </div>
    );
  }

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return format(toZonedTime(date, 'UTC'), "PPP 'at' h:mm:ss a");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <BookText className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl md:text-2xl font-bold text-foreground">
                    Activity Logs
                </span>
            </div>
            <Button asChild variant="outline">
               <Link href="/admin/dashboard">
                    <ArrowLeft className="mr-2" /> Back to Dashboard
               </Link>
            </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto px-0.5">
            <Card>
                <CardHeader>
                    <CardTitle>Audit Trail</CardTitle>
                    <CardDescription>A chronological record of all actions performed on the site.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[25%]">Timestamp</TableHead>
                                <TableHead className="w-[15%]">User</TableHead>
                                <TableHead className="w-[20%]">Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length > 0 ? (
                                logs.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">{formatDate(log.timestamp)}</TableCell>
                                        <TableCell className="font-mono text-xs">{log.userEmail}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{JSON.stringify(log.details)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No log entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
