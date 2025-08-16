
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  doc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  ProblemStatementDialog,
  type ProblemStatement,
} from "@/components/admin/ProblemStatementDialog";
import {
  TimelineEventDialog,
  type TimelineEvent,
} from "@/components/admin/TimelineEventDialog";
import { DomainDialog, type Domain } from "@/components/admin/DomainDialog";
import { DuplicatesDialog } from "@/components/admin/DuplicatesDialog";

import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { EventSnapshot } from "@/components/admin/dashboard/EventSnapshot";
import { SiteControls } from "@/components/admin/dashboard/SiteControls";
import { LiveBanner } from "@/components/admin/dashboard/LiveBanner";
import { PreviousDomains } from "@/components/admin/dashboard/PreviousDomains";
import { TimelineControl } from "@/components/admin/dashboard/TimelineControl";
import { ProblemsControl } from "@/components/admin/dashboard/ProblemsControl";
import { TeamsTable } from "@/components/admin/dashboard/TeamsTable";
import { logActivity } from "@/lib/logger";

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
  createdAt?: Timestamp;
}

export type DuplicateInfo = {
  type: "Email" | "Phone" | "Register Number";
  value: string;
  teams: { teamId: string; teamName: string; memberName: string }[];
};

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [problemsReleased, setProblemsReleased] = useState(false);
  const [liveBannerText, setLiveBannerText] = useState("");
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [isDomainDialogOpen, setIsDomainDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemStatement | null>(
    null
  );
  const [editingTimelineEvent, setEditingTimelineEvent] =
    useState<TimelineEvent | null>(null);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [duplicates, setDuplicates] = useState<DuplicateInfo[]>([]);
  const [isDuplicatesDialogOpen, setIsDuplicatesDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/admin");
      }
    });

    if (!user) return () => unsubscribeAuth();

    const teamsQuery = query(collection(db, "registrations"));
    const unsubscribeTeams = onSnapshot(teamsQuery, (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Team[];

      teamsData.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return aTime - bTime;
      });

      setTeams(teamsData);
    });

    const unsubscribeProblems = onSnapshot(
      query(collection(db, "problems")),
      (snapshot) => {
        const problemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ProblemStatement[];
        setProblems(problemsData);
      }
    );

    const unsubscribeTimeline = onSnapshot(
      query(collection(db, "timeline"), orderBy("date")),
      (snapshot) => {
        const eventsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date, // Keep as yyyy-mm-dd string
            title: data.title,
            description: data.description,
          };
        }) as TimelineEvent[];
        setTimelineEvents(eventsData);
      }
    );

    const unsubscribeDomains = onSnapshot(
      query(collection(db, "domains")),
      (snapshot) => {
        const domainsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Domain[];
        setDomains(domainsData);
      },
      (error) => {
        console.error("Firestore 'domains' listener error:", error);
        if ((error as any).code === "permission-denied") {
          toast({
            variant: "destructive",
            title: "Firestore Permission Error",
            description:
              "Could not read 'domains'. Please update your Firestore security rules to allow reads for authenticated users on the 'domains' collection.",
            duration: 10000,
          });
        }
      }
    );

    const unsubscribeSettings = onSnapshot(
      doc(db, "settings", "features"),
      (doc) => {
        if (doc.exists()) {
          setProblemsReleased(doc.data().problemsReleased);
        }
      }
    );

    const unsubscribeBanner = onSnapshot(
      doc(db, "settings", "liveBanner"),
      (doc) => {
        if (doc.exists()) {
          setLiveBannerText(doc.data().text);
        }
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeTeams();
      unsubscribeProblems();
      unsubscribeSettings();
      unsubscribeTimeline();
      unsubscribeBanner();
      unsubscribeDomains();
    };
  }, [isClient, user, router, toast]);

  useEffect(() => {
    // Re-calculate duplicates whenever the teams data changes and the dialog is open
    if (isDuplicatesDialogOpen) {
      findDuplicates(false); // don't re-open the dialog
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, isDuplicatesDialogOpen]);

  const filteredTeams = useMemo(() => {
    if (!searchQuery) {
      return teams;
    }
    return teams.filter((team) => {
      const query = searchQuery.toLowerCase();
      const teamNameMatch = team.teamName.toLowerCase().includes(query);
      const memberMatch = team.members.some(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.registerNumber.toLowerCase().includes(query)
      );
      return teamNameMatch || memberMatch;
    });
  }, [teams, searchQuery]);

  const totalParticipants = teams.reduce(
    (acc, team) => acc + team.members.length,
    0
  );

  const handleLogout = async () => {
    const userEmail = user?.email || 'unknown_user';
    await signOut(auth);
    await logActivity('Admin Logout', { user: userEmail });
    router.push("/");
  };

  const handleReleaseToggle = async (checked: boolean) => {
    try {
      await setDoc(
        doc(db, "settings", "features"),
        { problemsReleased: checked },
        { merge: true }
      );
      setProblemsReleased(checked);
      toast({
        title: "Success!",
        description: `Problem statements are now ${
          checked ? "live" : "hidden"
        }.`,
      });
      await logActivity('Toggled Problem Statement Release', { released: checked });
    } catch (error) {
      console.error("Error updating settings: ", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the setting. Please try again.",
      });
    }
  };

  const handleSaveBanner = async () => {
    setIsSavingBanner(true);
    try {
      const oldText = (await doc(db, "settings", "liveBanner").get()).data()?.text || "";
      await setDoc(doc(db, "settings", "liveBanner"), { text: liveBannerText });
      toast({
        title: "Success!",
        description: "Live banner has been updated.",
      });
      await logActivity('Live Banner Updated', { from: oldText, to: liveBannerText });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the banner. Please try again.",
      });
    } finally {
      setIsSavingBanner(false);
    }
  };

  // Domain Handlers
  const handleAddNewDomain = () => {
    setEditingDomain(null);
    setIsDomainDialogOpen(true);
  };

  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setIsDomainDialogOpen(true);
  };

  const handleDeleteDomain = async (domainId: string) => {
    try {
      const domainToDelete = domains.find(d => d.id === domainId);
      await deleteDoc(doc(db, "domains", domainId));
      toast({ title: "Success", description: "Domain deleted." });
      await logActivity('Domain Deleted', { domainId, title: domainToDelete?.title });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete domain.",
      });
    }
  };

  const handleSaveDomain = async (domainData: Omit<Domain, "id">) => {
    try {
      if (editingDomain) {
        await updateDoc(doc(db, "domains", editingDomain.id), domainData);
        toast({ title: "Success", description: "Domain updated." });
        await logActivity('Domain Updated', { domainId: editingDomain.id, ...domainData });
      } else {
        const newDoc = await addDoc(collection(db, "domains"), domainData);
        toast({ title: "Success", description: "Domain added." });
        await logActivity('Domain Added', { domainId: newDoc.id, ...domainData });
      }
      setIsDomainDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save domain.",
      });
    }
  };

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
      const problemToDelete = problems.find(p => p.id === problemId);
      await deleteDoc(doc(db, "problems", problemId));
      toast({ title: "Success", description: "Problem statement deleted." });
      await logActivity('Problem Deleted', { problemId, title: problemToDelete?.title });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete problem statement.",
      });
    }
  };

  const handleSaveProblem = async (
    problemData: Omit<ProblemStatement, "id">
  ) => {
    try {
      if (editingProblem) {
        await updateDoc(doc(db, "problems", editingProblem.id), problemData);
        toast({ title: "Success", description: "Problem statement updated." });
        await logActivity('Problem Updated', { problemId: editingProblem.id, ...problemData });

      } else {
        const newDoc = await addDoc(collection(db, "problems"), problemData);
        toast({ title: "Success", description: "Problem statement added." });
        await logActivity('Problem Added', { problemId: newDoc.id, ...problemData });
      }
      setIsProblemDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save problem.",
      });
    }
  };

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
      const eventToDelete = timelineEvents.find(e => e.id === eventId);
      await deleteDoc(doc(db, "timeline", eventId));
      toast({ title: "Success", description: "Timeline event deleted." });
      await logActivity('Timeline Event Deleted', { eventId, title: eventToDelete?.title });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete timeline event.",
      });
    }
  };

  const handleSaveTimelineEvent = async (
    eventData: Omit<TimelineEvent, "id">
  ) => {
    try {
      if (editingTimelineEvent) {
        await updateDoc(
          doc(db, "timeline", editingTimelineEvent.id),
          eventData
        );
        toast({ title: "Success", description: "Timeline event updated." });
        await logActivity('Timeline Event Updated', { eventId: editingTimelineEvent.id, ...eventData });
      } else {
        const newDoc = await addDoc(collection(db, "timeline"), eventData);
        toast({ title: "Success", description: "Timeline event added." });
        await logActivity('Timeline Event Added', { eventId: newDoc.id, ...eventData });
      }
      setIsTimelineDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save timeline event.",
      });
    }
  };

  const handleSyncToSheet = async () => {
    if (teams.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "There are no registered teams to sync.",
      });
      return;
    }
    setIsSyncing(true);
    try {
      const response = await fetch("/api/sync-to-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamsData: teams }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to sync to Google Sheet.");
      }

      toast({
        title: "Sync Successful",
        description: `Successfully synced ${teams.length} teams to the Google Sheet.`,
      });
      await logActivity('Manual Bulk Sync to Google Sheet', { teamCount: teams.length });
    } catch (error) {
      console.error("Failed to sync to sheet:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description:
          (error as Error).message || "An unknown error occurred during sync.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

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

      const transformedData = teams.map((team) => {
        const row: { [key: string]: any } = {
          "Team Name": team.teamName,
        };

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
      await logActivity('Exported Registrations to Excel', { teamCount: teams.length });
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
  const findDuplicates = (openDialog = true) => {
    const emailMap = new Map<
      string,
      { teamId: string; teamName: string; memberName: string }[]
    >();
    const phoneMap = new Map<
      string,
      { teamId: string; teamName: string; memberName: string }[]
    >();
    const regNoMap = new Map<
      string,
      { teamId: string; teamName: string; memberName: string }[]
    >();

    teams.forEach((team) => {
      team.members.forEach((member) => {
        const memberInfo = {
          teamId: team.id,
          teamName: team.teamName,
          memberName: member.name,
        };

        // Check email
        const emails = emailMap.get(member.email) || [];
        emailMap.set(member.email, [...emails, memberInfo]);

        // Check phone
        const phones = phoneMap.get(member.phone) || [];
        phoneMap.set(member.phone, [...phones, memberInfo]);

        // Check register number
        const regNos = regNoMap.get(member.registerNumber) || [];
        regNoMap.set(member.registerNumber, [...regNos, memberInfo]);
      });
    });

    const foundDuplicates: DuplicateInfo[] = [];

    emailMap.forEach((teams, value) => {
      if (teams.length > 1) {
        foundDuplicates.push({ type: "Email", value, teams });
      }
    });
    phoneMap.forEach((teams, value) => {
      if (teams.length > 1) {
        foundDuplicates.push({ type: "Phone", value, teams });
      }
    });
    regNoMap.forEach((teams, value) => {
      if (teams.length > 1) {
        foundDuplicates.push({ type: "Register Number", value, teams });
      }
    });

    setDuplicates(foundDuplicates);
    if (openDialog) {
        setIsDuplicatesDialogOpen(true);
        logActivity('Duplicate Scan Performed', { found: foundDuplicates.length });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const teamToDelete = teams.find(t => t.id === teamId);
      await deleteDoc(doc(db, "registrations", teamId));
      toast({
        title: "Success",
        description: "Team registration has been deleted.",
      });
      await logActivity('Team Deleted', { teamId, teamName: teamToDelete?.teamName });
      // The onSnapshot listener for teams will automatically update the UI.
      // The useEffect for duplicates will re-calculate the list.
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the team registration.",
      });
      console.error("Error deleting team:", error);
    }
  };

  if (!isClient || !user) {
    return <DashboardSkeleton />;
  }

  const superAdminEmails = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map(email => email.trim());

  const isSuperAdmin = user.email ? superAdminEmails.includes(user.email) : false;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DashboardHeader onLogout={handleLogout} isSuperAdmin={isSuperAdmin} />

      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto grid px-0.5 auto-rows-max grid-cols-1 gap-8">
          <EventSnapshot
            teamsCount={teams.length}
            participantsCount={totalParticipants}
          />

          <SiteControls
            problemsReleased={problemsReleased}
            onReleaseToggle={handleReleaseToggle}
          />

          <LiveBanner
            liveBannerText={liveBannerText}
            setLiveBannerText={setLiveBannerText}
            onSave={handleSaveBanner}
            isSaving={isSavingBanner}
          />

          <PreviousDomains
            domains={domains}
            onAddNew={handleAddNewDomain}
            onEdit={handleEditDomain}
            onDelete={handleDeleteDomain}
          />

          <TimelineControl
            timelineEvents={timelineEvents}
            onAddNew={handleAddNewTimelineEvent}
            onEdit={handleEditTimelineEvent}
            onDelete={handleDeleteTimelineEvent}
          />

          <ProblemsControl
            problems={problems}
            onAddNew={handleAddNewProblem}
            onEdit={handleEditProblem}
            onDelete={handleDeleteProblem}
          />

          <TeamsTable
            teams={filteredTeams}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSyncToSheet={handleSyncToSheet}
            isSyncing={isSyncing}
            onExportToExcel={handleExportToExcel}
            isExporting={isExporting}
            onFindDuplicates={() => findDuplicates(true)}
            isSuperAdmin={isSuperAdmin}
          />
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
      <DomainDialog
        isOpen={isDomainDialogOpen}
        onClose={() => setIsDomainDialogOpen(false)}
        onSave={handleSaveDomain}
        domain={editingDomain}
      />
      <DuplicatesDialog
        isOpen={isDuplicatesDialogOpen}
        onClose={() => setIsDuplicatesDialogOpen(false)}
        duplicates={duplicates}
        onDeleteTeam={handleDeleteTeam}
      />
    </div>
  );
}
