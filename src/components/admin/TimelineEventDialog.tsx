
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";


const timelineEventSchema = z.object({
    date: z.string({
        required_error: "A date is required.",
    }),
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
});

export type TimelineEvent = z.infer<typeof timelineEventSchema> & { id: string };

interface TimelineEventDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<TimelineEvent, 'id'>) => void;
    event: TimelineEvent | null;
}

export function TimelineEventDialog({ isOpen, onClose, onSave, event }: TimelineEventDialogProps) {
  const form = useForm<z.infer<typeof timelineEventSchema>>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
        date: "",
        title: "",
        description: "",
    }
  });
  
  useEffect(() => {
    if (event) {
        form.reset({
            ...event,
            date: event.date ? format(new Date(event.date), "PPP") : ""
        });
    } else {
        form.reset({ date: "", title: "", description: "" });
    }
  }, [event, form, isOpen])


  const onSubmit = (values: z.infer<typeof timelineEventSchema>) => {
    onSave({
        ...values,
        date: format(new Date(values.date), "yyyy-MM-dd")
    });
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
                                        >
                                        {field.value ? (
                                            format(new Date(field.value), "PPP")
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
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                        initialFocus
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
                                    <Input placeholder="e.g., Hackathon Kickoff" {...field} />
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
                                    <Textarea placeholder="Describe the event..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Event</Button>
                    </DialogFooter>
                </form>
             </Form>
        </DialogContent>
    </Dialog>
  )
}
