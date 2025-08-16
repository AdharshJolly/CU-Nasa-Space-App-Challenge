
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, PlusCircle, ShieldAlert, Trash2 } from "lucide-react";
import type { ProblemStatement } from "@/components/admin/ProblemStatementDialog";


interface ProblemsControlProps {
    problems: ProblemStatement[];
    onAddNew: () => void;
    onEdit: (problem: ProblemStatement) => void;
    onDelete: (id: string) => void;
}

export function ProblemsControl({ problems, onAddNew, onEdit, onDelete }: ProblemsControlProps) {
    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6" />
                  <CardTitle>Problem Statements</CardTitle>
                </div>
                <CardDescription>
                  Add, edit, or delete challenge statements.
                </CardDescription>
              </div>
              <Button onClick={onAddNew}>
                <PlusCircle className="mr-2" /> Add New Problem
              </Button>
            </CardHeader>
            <CardContent>
              <div className="md:hidden space-y-4">
                {problems.map((problem) => (
                  <Card key={problem.id} className="p-4">
                    <CardHeader className="p-2">
                      <CardTitle className="text-base">
                        {problem.title}
                      </CardTitle>
                      <CardDescription>{problem.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 text-sm text-muted-foreground">
                      {problem.description}
                    </CardContent>
                    <CardFooter className="p-2 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(problem)}
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
                              This will permanently delete this problem.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(problem.id)}
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
                    <TableHead className="w-[20%]">Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problems.map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell className="font-medium">
                        {problem.title}
                      </TableCell>
                      <TableCell>{problem.category}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {problem.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(problem)}
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
                              <div className="flex items-center gap-2">
                                <ShieldAlert className="h-6 w-6 text-destructive" />
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                              </div>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this problem statement.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(problem.id)}
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
