
"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2, PlusCircle, Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

const sectionSchema = z.object({
    subheading: z.string().min(3, "Subheading must be at least 3 characters."),
    content: z.string().min(10, "Content must be at least 10 characters."),
});

const problemSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    category: z.string().min(3, "Category is required."),
    description: z.string().min(20, "Description must be at least 20 characters."),
    sections: z.array(sectionSchema).optional(),
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
        sections: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });
  
  useEffect(() => {
    if (problem) {
        form.reset(problem);
    } else {
        form.reset({ title: "", category: "", description: "", sections: [] });
    }
  }, [problem, form, isOpen])

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof problemSchema>) => {
    await onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{problem ? "Edit Problem Statement" : "Add New Problem Statement"}</DialogTitle>
                <DialogDescription>
                    {problem ? "Make changes to the existing challenge." : "Fill in the details for the new challenge."}
                </DialogDescription>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <ScrollArea className="h-[70vh] pr-6">
                        <div className="space-y-4 p-1">
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
                                        <FormLabel>Main Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the main challenge overview..." {...field} rows={5} disabled={isSubmitting}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            <div>
                                <h3 className="text-lg font-medium mb-2">Detailed Sections</h3>
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="p-4 border rounded-lg relative bg-card/50">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-semibold">Section #{index + 1}</h4>
                                                <Button type="button" variant="destructive" size="icon" className="h-7 w-7" onClick={() => remove(index)} disabled={isSubmitting}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-4">
                                                <FormField control={form.control} name={`sections.${index}.subheading`} render={({ field }) => (<FormItem><FormLabel>Subheading</FormLabel><FormControl><Input placeholder="e.g., Background" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name={`sections.${index}.content`} render={({ field }) => (<FormItem><FormLabel>Content</FormLabel><FormControl><Textarea placeholder="Detailed content for this section..." {...field} rows={4} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <Button type="button" variant="outline" onClick={() => append({ subheading: "", content: ""})} disabled={isSubmitting}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                            </Button>
                        </div>
                    </ScrollArea>
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
