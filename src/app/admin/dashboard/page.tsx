
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { collection, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, query, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Rocket, Settings, Pencil, Trash2, PlusCircle, CalendarDays } from "lucide-react";
import { ProblemStatementDialog, type ProblemStatement } from "@/components/admin/ProblemStatementDialog";
import { TimelineEventDialog, type TimelineEvent } from "@/components/admin/TimelineEventDialog";


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
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [problemsReleased, setProblemsReleased] = useState(false);
  const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemStatement | null>(null);
  const [editingTimelineEvent, setEditingTimelineEvent] = useState<TimelineEvent | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/admin");
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const unsubscribeTeams = onSnapshot(query(collection(db, "registrations")), (snapshot) => {
        const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Team[];
        setTeams(teamsData);
    });

    const unsubscribeProblems = onSnapshot(query(collection(db, "problems")), (snapshot) => {
        const problemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProblemStatement[];
        setProblems(problemsData);
    });
    
    const unsubscribeTimeline = onSnapshot(query(collection(db, "timeline")), (snapshot) => {
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineEvent));
        // Simple sort by date string, assuming YYYY-MM-DD or similar format that sorts chronologically
        eventsData.sort((a, b) => a.date.localeCompare(b.date));
        setTimelineEvents(eventsData);
    });

    const unsubscribeSettings = onSnapshot(doc(db, "settings", "features"), (doc) => {
        if (doc.exists()) {
            setProblemsReleased(doc.data().problemsReleased);
        }
    });

    return () => {
        unsubscribeTeams();
        unsubscribeProblems();
        unsubscribeSettings();
        unsubscribeTimeline();
    };
  }, [user]);

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

  // Problem Statement Handlers
  const handleAddNewProblem = () => {
    setEditingProblem(null);
    setIsProblemDialogOpen(true);
  };

  const handleEditProblem = (problem: ProblemStatement) => {
    setEditingProblem(problem);
    setIsProblemDialogOpen(true);
  };

  const handleDeleteProblem = async (problemId: string) => {
      if (confirm("Are you sure you want to delete this problem statement?")) {
        try {
            await deleteDoc(doc(db, "problems", problemId));
            toast({ title: "Success", description: "Problem statement deleted." });
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Could not delete problem statement." });
        }
      }
  }

  const handleSaveProblem = async (problemData: Omit<ProblemStatement, 'id'>) => {
    try {
        if (editingProblem) {
            await updateDoc(doc(db, "problems", editingProblem.id), problemData);
            toast({ title: "Success", description: "Problem statement updated." });
        } else {
            await addDoc(collection(db, "problems"), problemData);
            toast({ title: "Success", description: "Problem statement added." });
        }
        setIsProblemDialogOpen(false);
    } catch(error) {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save problem." });
    }
  }
  
  // Timeline Event Handlers
  const handleAddNewTimelineEvent = () => {
    setEditingTimelineEvent(null);
    setIsTimelineDialogOpen(true);
  };

  const handleEditTimelineEvent = (event: TimelineEvent) => {
    setEditingTimelineEvent(event);
    setIsTimelineDialogOpen(true);
  };
  
  const handleDeleteTimelineEvent = async (eventId: string) => {
      if (confirm("Are you sure you want to delete this timeline event?")) {
        try {
            await deleteDoc(doc(db, "timeline", eventId));
            toast({ title: "Success", description: "Timeline event deleted." });
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Could not delete timeline event." });
        }
      }
  }

  const handleSaveTimelineEvent = async (eventData: Omit<TimelineEvent, 'id'>) => {
    try {
        if (editingTimelineEvent) {
            await updateDoc(doc(db, "timeline", editingTimelineEvent.id), eventData);
            toast({ title: "Success", description: "Timeline event updated." });
        } else {
            await addDoc(collection(db, "timeline"), eventData);
            toast({ title: "Success", description: "Timeline event added." });
        }
        setIsTimelineDialogOpen(false);
    } catch(error) {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save timeline event." });
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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                             <div className="flex items-center gap-2">
                                <CalendarDays className="h-6 w-6" />
                                <CardTitle>Event Timeline</CardTitle>
                            </div>
                            <CardDescription>Manage the event schedule shown on the homepage.</CardDescription>
                        </div>
                        <Button onClick={handleAddNewTimelineEvent}>
                            <PlusCircle className="mr-2"/> Add New Event
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[25%]">Date</TableHead>
                                    <TableHead className="w-[30%]">Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timelineEvents.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.date}</TableCell>
                                        <TableCell>{event.title}</TableCell>
                                        <TableCell className="text-muted-foreground">{event.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditTimelineEvent(event)}>
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteTimelineEvent(event.id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Problem Statements</CardTitle>
                            <CardDescription>Add, edit, or delete challenge statements.</CardDescription>
                        </div>
                        <Button onClick={handleAddNewProblem}>
                            <PlusCircle className="mr-2"/> Add New Problem
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30%]">Title</TableHead>
                                    <TableHead className="w-[20%]">Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {problems.map((problem) => (
                                    <TableRow key={problem.id}>
                                        <TableCell className="font-medium">{problem.title}</TableCell>
                                        <TableCell>{problem.category}</TableCell>
                                        <TableCell className="text-muted-foreground">{problem.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditProblem(problem)}>
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteProblem(problem.id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
        <ProblemStatementDialog
            isOpen={isProblemDialogOpen}
            onClose={() => setIsProblemDialogOpen(false)}
            onSave={handleSaveProblem}
            problem={editingProblem}
        />
         <TimelineEventDialog
            isOpen={isTimelineDialogOpen}
            onClose={() => setIsTimelineDialogOpen(false)}
            onSave={handleSaveTimelineEvent}
            event={editingTimelineEvent}
        />
    </div>
  );
}

    