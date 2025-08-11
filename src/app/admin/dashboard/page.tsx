
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { collection, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, query, doc, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Rocket, Settings, Pencil, Trash2, PlusCircle, CalendarDays, Download, Loader2, Megaphone, Users, ShieldAlert, BadgeInfo } from "lucide-react";
import { ProblemStatementDialog, type ProblemStatement } from "@/components/admin/ProblemStatementDialog";
import { TimelineEventDialog, type TimelineEvent } from "@/components/admin/TimelineEventDialog";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";


interface TeamMember {
    name: string;
    email: string;
    phone: string;
    registerNumber: string;
    className: string;
    department: string;
    school: string;
}

interface Team {
    id: string;
    teamName: string;
    members: TeamMember[];
}

const DashboardSkeleton = () => (
    <div className="flex min-h-dvh flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
             <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Rocket className="h-7 w-7 text-primary" />
                    <Skeleton className="h-7 w-48" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
            <div className="container mx-auto grid gap-8 animate-pulse">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                         <Skeleton className="h-24 w-full" />
                         <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                             <Skeleton className="h-6 w-1/4 mb-2" />
                             <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    </div>
)

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [problemsReleased, setProblemsReleased] = useState(false);
  const [liveBannerText, setLiveBannerText] = useState("");
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [challengeDomains, setChallengeDomains] = useState("");
  const [isSavingDomains, setIsSavingDomains] = useState(false);
  const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemStatement | null>(null);
  const [editingTimelineEvent, setEditingTimelineEvent] = useState<TimelineEvent | null>(null);
  const [isExporting, setIsExporting] = useState(false);
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
    
    const unsubscribeTimeline = onSnapshot(query(collection(db, "timeline"), orderBy("date")), (snapshot) => {
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineEvent));
        setTimelineEvents(eventsData);
    });

    const unsubscribeSettings = onSnapshot(doc(db, "settings", "features"), (doc) => {
        if (doc.exists()) {
            setProblemsReleased(doc.data().problemsReleased);
        }
    });

    const unsubscribeBanner = onSnapshot(doc(db, "settings", "liveBanner"), (doc) => {
        if (doc.exists()) {
            setLiveBannerText(doc.data().text);
        }
    });

    const unsubscribeDomains = onSnapshot(doc(db, "settings", "challengeDomains"), (doc) => {
        if (doc.exists()) {
            setChallengeDomains(doc.data().domains || "");
        }
    });

    return () => {
        unsubscribeTeams();
        unsubscribeProblems();
        unsubscribeSettings();
        unsubscribeTimeline();
        unsubscribeBanner();
        unsubscribeDomains();
    };
  }, [user]);
  
  const totalParticipants = teams.reduce((acc, team) => acc + team.members.length, 0);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  const handleReleaseToggle = async (checked: boolean) => {
      try {
          await setDoc(doc(db, "settings", "features"), { problemsReleased: checked }, { merge: true });
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

  const handleSaveBanner = async () => {
      setIsSavingBanner(true);
      try {
          await setDoc(doc(db, "settings", "liveBanner"), { text: liveBannerText });
          toast({
              title: "Success!",
              description: "Live banner has been updated."
          })
      } catch(error) {
           toast({
              variant: "destructive",
              title: "Update Failed",
              description: "Could not update the banner. Please try again."
          })
      } finally {
        setIsSavingBanner(false);
      }
  }

  const handleSaveDomains = async () => {
    setIsSavingDomains(true);
    try {
        await setDoc(doc(db, "settings", "challengeDomains"), { domains: challengeDomains });
        toast({
            title: "Success!",
            description: "Challenge domains have been updated."
        })
    } catch(error) {
         toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the domains. Please try again."
        })
    } finally {
      setIsSavingDomains(false);
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
    try {
        await deleteDoc(doc(db, "problems", problemId));
        toast({ title: "Success", description: "Problem statement deleted." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete problem statement." });
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
    try {
        await deleteDoc(doc(db, "timeline", eventId));
        toast({ title: "Success", description: "Timeline event deleted." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete timeline event." });
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

  const handleExportToExcel = async () => {
    if (teams.length === 0) {
        toast({
            variant: "destructive",
            title: "No Data",
            description: "There are no registered teams to export.",
        });
        return;
    }
    setIsExporting(true);
    try {
        const XLSX = await import("xlsx");
        
        const transformedData = teams.map(team => {
            const row: {[key: string]: any} = { "Team Name": team.teamName };
            
            team.members.forEach((member, index) => {
                const memberNumber = index + 1;
                row[`Member ${memberNumber} Name`] = member.name;
                row[`Member ${memberNumber} Email`] = member.email;
                row[`Member ${memberNumber} Phone`] = member.phone;
                row[`Member ${memberNumber} Register Number`] = member.registerNumber;
                row[`Member ${memberNumber} Class`] = member.className;
                row[`Member ${memberNumber} Department`] = member.department;
                row[`Member ${memberNumber} School`] = member.school;
            });

            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        XLSX.writeFile(workbook, "registered_teams.xlsx");
        toast({
            title: "Export Successful",
            description: "The team data has been downloaded as an Excel file.",
        });
    } catch (error) {
        console.error("Failed to export to Excel:", error);
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: "Could not generate the Excel file. Please try again.",
        });
    } finally {
        setIsExporting(false);
    }
  };


  if (!user) {
    return <DashboardSkeleton />;
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
                        <CardTitle>Event Snapshot</CardTitle>
                        <CardDescription>A quick overview of your event's registration status.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                         <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Users className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{teams.length}</p>
                                    <p className="text-sm text-muted-foreground">Teams Registered</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Users className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{totalParticipants}</p>
                                    <p className="text-sm text-muted-foreground">Total Participants</p>
                                </div>
                            </div>
                        </Card>
                    </CardContent>
                </Card>

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
                         <div className="flex items-center gap-2">
                             <Megaphone className="h-6 w-6" />
                            <CardTitle>Live Banner</CardTitle>
                        </div>
                        <CardDescription>Update the announcement banner at the top of the site. Leave empty to hide it.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Enter banner text here..."
                            value={liveBannerText}
                            onChange={(e) => setLiveBannerText(e.target.value)}
                            disabled={isSavingBanner}
                        />
                        <Button onClick={handleSaveBanner} disabled={isSavingBanner}>
                             {isSavingBanner ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Banner"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                         <div className="flex items-center gap-2">
                             <BadgeInfo className="h-6 w-6" />
                            <CardTitle>Challenge Domains</CardTitle>
                        </div>
                        <CardDescription>Enter a comma-separated list of domains to show before problems are released.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="e.g., Earth Observation, Space Exploration, Robotics..."
                            value={challengeDomains}
                            onChange={(e) => setChallengeDomains(e.target.value)}
                            disabled={isSavingDomains}
                        />
                        <Button onClick={handleSaveDomains} disabled={isSavingDomains}>
                             {isSavingDomains ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Domains"
                            )}
                        </Button>
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
                                        <TableCell className="font-medium">{format(new Date(event.date), "PPP")}</TableCell>
                                        <TableCell>{event.title}</TableCell>
                                        <TableCell className="text-muted-foreground">{event.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditTimelineEvent(event)}>
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this timeline event.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteTimelineEvent(event.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Yes, delete it
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                         <div className="flex items-center gap-2">
                                                            <ShieldAlert className="h-6 w-6 text-destructive"/>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        </div>
                                                        <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this problem statement.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteProblem(problem.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Yes, delete it
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
                            <CardTitle>Registered Teams</CardTitle>
                            <CardDescription>A list of all teams registered for the Space Apps Challenge.</CardDescription>
                        </div>
                         <Button onClick={handleExportToExcel} disabled={teams.length === 0 || isExporting}>
                            {isExporting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2" />
                                    Download as Excel
                                </>
                            )}
                        </Button>
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
                                                        <br />
                                                        <span className="text-xs text-muted-foreground">
                                                            RegNo: {member.registerNumber} | Class: {member.className} | Dept: {member.department} | School: {member.school}
                                                        </span>
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

    