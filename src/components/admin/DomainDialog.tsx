
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

const domainSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
});

export type Domain = z.infer<typeof domainSchema> & { id: string };

interface DomainDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Domain, 'id'>) => Promise<void>;
    domain: Domain | null;
}

export function DomainDialog({ isOpen, onClose, onSave, domain }: DomainDialogProps) {
  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
        title: "",
        description: "",
    }
  });
  
  useEffect(() => {
    if (domain) {
        form.reset(domain);
    } else {
        form.reset({ title: "", description: "" });
    }
  }, [domain, form, isOpen])

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof domainSchema>) => {
    await onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>{domain ? "Edit Domain" : "Add New Domain"}</DialogTitle>
                <DialogDescription>
                    {domain ? "Make changes to the existing domain." : "Fill in the details for the new domain."}
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
                                    <Input placeholder="e.g., Earth Observation" {...field} disabled={isSubmitting} />
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
                                    <Textarea placeholder="Describe the domain..." {...field} disabled={isSubmitting}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Domain
                        </Button>
                    </DialogFooter>
                </form>
             </Form>
        </DialogContent>
    </Dialog>
  )
}
