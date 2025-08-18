
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown, Users } from "lucide-react";
import { useState } from "react";

interface EventSnapshotProps {
    teamsCount: number;
    participantsCount: number;
}

export function EventSnapshot({ teamsCount, participantsCount }: EventSnapshotProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center cursor-pointer p-6">
                        <div>
                            <CardTitle>Event Snapshot</CardTitle>
                            <CardDescription>
                                A quick overview of your event's registration status.
                            </CardDescription>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                        <div className="flex items-center gap-4">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{teamsCount}</p>
                            <p className="text-sm text-muted-foreground">
                            Teams Registered
                            </p>
                        </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-4">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{participantsCount}</p>
                            <p className="text-sm text-muted-foreground">
                            Total Participants
                            </p>
                        </div>
                        </div>
                    </Card>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}
