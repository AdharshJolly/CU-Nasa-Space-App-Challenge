
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronsUpDown, Pencil, PlusCircle, Trash2, Users } from "lucide-react";
import type { AppUser } from "@/app/admin/dashboard/page";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface UserManagementProps {
    users: AppUser[];
    onAddNew: () => void;
    onEdit: (user: AppUser) => void;
    onDelete: (uid: string) => void;
}

export function UserManagement({ users, onAddNew, onEdit, onDelete }: UserManagementProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <div className="flex items-start justify-between p-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            <CardTitle>User Management</CardTitle>
                        </div>
                        <CardDescription className="mt-1.5">
                            Create, edit, and manage users and their roles.
                        </CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={onAddNew} size="sm" className="ml-auto flex-shrink-0">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
                        </Button>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronsUpDown className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>
                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <div className="md:hidden space-y-4">
                            {users.map((user) => (
                                <Card key={user.uid} className="p-4">
                                    <CardHeader className="p-2 space-y-1">
                                        <CardTitle className="text-base truncate">
                                            {user.email}
                                        </CardTitle>
                                        <CardDescription className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                                            {user.vertical && <Badge variant="outline">{user.vertical}</Badge>}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="p-2 flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure you want to delete {user.email}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete this user from Authentication and Firestore. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => onDelete(user.uid)} className="bg-destructive hover:bg-destructive/90">
                                                        Delete User
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
                                    <TableHead className="w-[40%]">Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Vertical</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.uid}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.vertical ? <Badge variant="outline">{user.vertical}</Badge> : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure you want to delete {user.email}?</AlertDialogTitle>
                                                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the user from Firebase Authentication and remove their role from the system.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => onDelete(user.uid)} className="bg-destructive hover:bg-destructive/90">
                                                            Yes, delete this user
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
