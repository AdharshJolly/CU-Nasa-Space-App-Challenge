"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Rocket, Settings } from "lucide-react";

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
  const [problemsReleased, setProblemsReleased] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTeams();
      } else {
        router.push("/admin");
      }
    });

    const unsubscribeSettings = onSnapshot(doc(db, "settings", "features"), (doc) => {
        if (doc.exists()) {
            setProblemsReleased(doc.data().problemsReleased);
        }
    });

    return () => {
        unsubscribeAuth();
        unsubscribeSettings();
    };
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

  const handleReleaseToggle = async (checked: boolean) => {
      try {
          await setDoc(doc(db, "settings", "features"), { problemsReleased: checked });
          setProblemsReleased(checked);
          toast({
              title: "Success!",
              description: `Problem statements are now ${checked ? 'live' : 'hidden'}.`
          })
      } catch (error) {
          console.error("Error updating settings: ", error);
          toast({
              variant: "destructive",
              title: "Update Failed",
              description: "Could not update the setting. Please try again."
          })
      }
  }

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
            <div className="container mx-auto grid gap-8">
                 <Card>
                    <CardHeader>
                         <div className="flex items-center gap-2">
                             <Settings className="h-6 w-6" />
                            <CardTitle>Site Controls</CardTitle>
                        </div>
                        <CardDescription>Control feature visibility on the main website.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4 rounded-md border p-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">Release Problem Statements</p>
                                <p className="text-sm text-muted-foreground">
                                Make the challenges visible to all participants on the main page.
                                </p>
                            </div>
                            <Switch
                                id="release-problems"
                                checked={problemsReleased}
                                onCheckedChange={handleReleaseToggle}
                            />
                        </div>
                    </CardContent>
                </Card>
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
