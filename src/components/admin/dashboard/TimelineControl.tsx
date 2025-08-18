
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarDays, ChevronsUpDown, Pencil, PlusCircle, Trash2 } from "lucide-react";
import type { TimelineEvent } from "@/components/admin/TimelineEventDialog";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface TimelineControlProps {
    timelineEvents: TimelineEvent[];
    onAddNew: () => void;
    onEdit: (event: TimelineEvent) => void;
    onDelete: (id: string) => void;
}

const formatDateInUTC = (dateString: string) => {
    if (!dateString) return "No date";
    // Create a date object, assuming the string is already in UTC (yyyy-mm-dd)
    const date = new Date(`${dateString}T00:00:00Z`);
    // Format it in UTC to avoid timezone shifts in display
    return format(toZonedTime(date, 'UTC'), "PPP");
};

export function TimelineControl({ timelineEvents, onAddNew, onEdit, onDelete }: TimelineControlProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <CollapsibleTrigger asChild>
                    <div className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                        <CalendarDays className="h-6 w-6" />
                        <CardTitle>Event Timeline</CardTitle>
                         <ChevronsUpDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                        </div>
                        <CardDescription>
                        Manage the event schedule shown on the homepage.
                        </CardDescription>
                    </div>
                </CollapsibleTrigger>
                <Button onClick={onAddNew} className="flex-shrink-0">
                    <PlusCircle className="mr-2" /> Add New Event
                </Button>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent>
                    <div className="md:hidden space-y-4">
                        {timelineEvents.map((event) => (
                        <Card key={event.id} className="p-4">
                            <CardHeader className="p-2">
                            <CardTitle className="text-base">{event.title}</CardTitle>
                            <CardDescription>
                                {formatDateInUTC(event.date)}
                            </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 text-sm text-muted-foreground">
                            {event.description}
                            </CardContent>
                            <CardFooter className="p-2 flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(event)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This will permanently delete this timeline event.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                    onClick={() => onDelete(event.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                    >
                                    Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                        ))}
                    </div>
                    <Table className="hidden md:table">
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
                            <TableCell className="font-medium">
                                {formatDateInUTC(event.date)}
                            </TableCell>
                            <TableCell>{event.title}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {event.description}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(event)}
                                >
                                <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    >
                                    <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this timeline event.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(event.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
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
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
