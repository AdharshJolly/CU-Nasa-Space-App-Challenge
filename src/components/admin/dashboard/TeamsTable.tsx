
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2, RefreshCw, Search, Users, ScanSearch } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";

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

interface TeamsTableProps {
    teams: Team[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSyncToSheet: () => void;
    isSyncing: boolean;
    onExportToExcel: () => void;
    isExporting: boolean;
    onFindDuplicates: () => void;
    isSuperAdmin: boolean;
}

export function TeamsTable({ teams, searchQuery, setSearchQuery, onSyncToSheet, isSyncing, onExportToExcel, isExporting, onFindDuplicates, isSuperAdmin }: TeamsTableProps) {
    return (
        <Card>
            <CardHeader className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    <CardTitle>Registered Teams</CardTitle>
                  </div>
                  <CardDescription>
                    A list of all teams registered for the Space Apps Challenge.
                    Sync is automatic, with manual override options.
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 flex-wrap justify-end">
                   {isSuperAdmin && (
                    <Button
                      variant="outline"
                      onClick={onFindDuplicates}
                      disabled={teams.length === 0}
                    >
                      <ScanSearch className="mr-2" />
                      Find Duplicates
                    </Button>
                   )}
                  <Button
                    variant="secondary"
                    onClick={onSyncToSheet}
                    disabled={teams.length === 0 || isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2" />
                        Sync to Google Sheet
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={onExportToExcel}
                    disabled={teams.length === 0 || isExporting}
                  >
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
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by team, name, email, or reg no..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="md:hidden space-y-4">
                {teams.map((team) => (
                  <Card key={team.id} className="p-4">
                    <CardHeader className="p-2">
                      <CardTitle className="text-base">
                        {team.teamName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 text-sm">
                      <ul className="space-y-3">
                        {team.members.map((member, index) => (
                          <li key={index} className="overflow-hidden">
                            <p className="font-semibold truncate">{member.name}</p>
                            <p className="text-muted-foreground truncate">
                              {member.email}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.registerNumber} | {member.className}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Table className="hidden md:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">
                        {team.teamName}
                      </TableCell>
                      <TableCell>
                        <ul className="list-disc pl-5">
                          {team.members.map((member, index) => (
                            <li key={index} className="mb-1">
                              {member.name} ({member.email}, {member.phone})
                              <br />
                              <span className="text-xs text-muted-foreground">
                                RegNo: {member.registerNumber} | Class:{" "}
                                {member.className} | Dept: {member.department} |
                                School: {member.school}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {teams.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No teams found matching your search query.</p>
                </div>
              )}
            </CardContent>
          </Card>
    );
}
