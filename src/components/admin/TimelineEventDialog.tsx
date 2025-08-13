
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";


const timelineEventSchema = z.object({
    date: z.date({
        required_error: "A date is required.",
    }),
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
});

export type TimelineEvent = z.infer<typeof timelineEventSchema> & { id: string; date: string };

interface TimelineEventDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<TimelineEvent, 'id'>) => Promise<void>;
    event: { id: string, date: string, title: string, description: string } | null;
}

export function TimelineEventDialog({ isOpen, onClose, onSave, event }: TimelineEventDialogProps) {
  const form = useForm<z.infer<typeof timelineEventSchema>>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
        title: "",
        description: "",
    }
  });
  
  useEffect(() => {
    if (isOpen) {
        if (event) {
            // Firestore timestamp might be a string, ensure it's a Date object
            const eventDate = event.date ? new Date(event.date) : new Date();
            // Adjust for timezone differences if the date is off by one day
            eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());
            form.reset({ ...event, date: eventDate });
        } else {
            form.reset({ date: undefined, title: "", description: "" });
        }
    }
  }, [event, form, isOpen])

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof timelineEventSchema>) => {
    await onSave({
        ...values,
        date: format(values.date, "yyyy-MM-dd")
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>{event ? "Edit Timeline Event" : "Add New Timeline Event"}</DialogTitle>
                <DialogDescription>
                    {event ? "Make changes to the existing event." : "Fill in the details for the new event."}
                </DialogDescription>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        disabled={isSubmitting}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                        disabled={isSubmitting}
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Hackathon Kickoff" {...field} disabled={isSubmitting} />
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
                                    <Textarea placeholder="Describe the event..." {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Event
                        </Button>
                    </DialogFooter>
                </form>
             </Form>
        </DialogContent>
    </Dialog>
  )
}
