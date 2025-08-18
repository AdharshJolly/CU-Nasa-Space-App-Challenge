
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface EventSnapshotProps {
    teamsCount: number;
    participantsCount: number;
}

export function EventSnapshot({ teamsCount, participantsCount }: EventSnapshotProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Snapshot</CardTitle>
                <CardDescription>
                    A quick overview of your event's registration status.
                </CardDescription>
            </CardHeader>
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
        </Card>
    )
}
