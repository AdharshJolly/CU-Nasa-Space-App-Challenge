"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Rocket } from "lucide-react";

interface TeamMember {
    name: string;
    email: string;
    phone: string;
}

interface Team {
    id: string;
    teamName: string;
    members: TeamMember[];
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTeams();
      } else {
        router.push("/admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchTeams = async () => {
    const querySnapshot = await getDocs(collection(db, "registrations"));
    const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Team[];
    setTeams(teamsData);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  if (!user) {
    return <div className="flex min-h-dvh items-center justify-center bg-background">Loading...</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
             <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Rocket className="h-7 w-7 text-primary" />
                    <span className="font-headline text-2xl font-bold text-foreground">Admin Dashboard</span>
                </div>
                <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="mr-2" /> Logout
                </Button>
            </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
            <div className="container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Registered Teams</CardTitle>
                        <CardDescription>A list of all teams registered for the Space Apps Challenge.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Team Name</TableHead>
                                    <TableHead>Members</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teams.map((team) => (
                                    <TableRow key={team.id}>
                                        <TableCell className="font-medium">{team.teamName}</TableCell>
                                        <TableCell>
                                            <ul className="list-disc pl-5">
                                                {team.members.map((member, index) => (
                                                    <li key={index} className="mb-1">
                                                        {member.name} ({member.email}, {member.phone})
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
