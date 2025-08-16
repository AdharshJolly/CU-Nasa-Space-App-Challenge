
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lightbulb, Pencil, PlusCircle, Trash2 } from "lucide-react";
import type { Domain } from "@/components/admin/DomainDialog";

interface PreviousDomainsProps {
    domains: Domain[];
    onAddNew: () => void;
    onEdit: (domain: Domain) => void;
    onDelete: (id: string) => void;
}

export function PreviousDomains({ domains, onAddNew, onEdit, onDelete }: PreviousDomainsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6" />
                    <CardTitle>Previous Year Domains</CardTitle>
                    </div>
                    <CardDescription>
                    Manage the example domains shown on the homepage.
                    </CardDescription>
                </div>
                <Button onClick={onAddNew}>
                    <PlusCircle className="mr-2" /> Add New Domain
                </Button>
            </CardHeader>
            <CardContent>
                <div className="md:hidden space-y-4">
                    {domains.map((domain) => (
                    <Card key={domain.id} className="p-4">
                        <CardHeader className="p-2">
                        <CardTitle className="text-base">
                            {domain.title}
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 text-sm text-muted-foreground">
                        {domain.description}
                        </CardContent>
                        <CardFooter className="p-2 flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(domain)}
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
                                This will permanently delete this domain.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                onClick={() => onDelete(domain.id)}
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
                        <TableHead className="w-[30%]">Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {domains.map((domain) => (
                        <TableRow key={domain.id}>
                        <TableCell className="font-medium">
                            {domain.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {domain.description}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(domain)}
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
                                    permanently delete this domain.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(domain.id)}
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
        </Card>
    );
}
