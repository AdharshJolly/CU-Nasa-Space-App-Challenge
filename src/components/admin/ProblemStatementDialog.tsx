
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const problemSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    category: z.string().min(3, "Category is required."),
    description: z.string().min(20, "Description must be at least 20 characters."),
});

export type ProblemStatement = z.infer<typeof problemSchema> & { id: string };

interface ProblemStatementDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<ProblemStatement, 'id'>) => Promise<void>;
    problem: ProblemStatement | null;
}

export function ProblemStatementDialog({ isOpen, onClose, onSave, problem }: ProblemStatementDialogProps) {
  const form = useForm<z.infer<typeof problemSchema>>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
        title: "",
        category: "",
        description: "",
    }
  });
  
  useEffect(() => {
    if (problem) {
        form.reset(problem);
    } else {
        form.reset({ title: "", category: "", description: "" });
    }
  }, [problem, form, isOpen])

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof problemSchema>) => {
    await onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>{problem ? "Edit Problem Statement" : "Add New Problem Statement"}</DialogTitle>
                <DialogDescription>
                    {problem ? "Make changes to the existing challenge." : "Fill in the details for the new challenge."}
                </DialogDescription>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Orbital Debris Mitigation" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Space Exploration" {...field} disabled={isSubmitting}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the challenge in detail..." {...field} disabled={isSubmitting}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Problem
                        </Button>
                    </DialogFooter>
                </form>
             </Form>
        </DialogContent>
    </Dialog>
  )
}

    