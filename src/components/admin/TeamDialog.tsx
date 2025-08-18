
"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2, Trash, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  registerNumber: string;
  className: string;
  department: string;
  school: string;
}

interface Team {
  id: string;
  teamName: string;
  members: TeamMember[];
}

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;
const schools = [
  "School of Architecture",
  "School of Business and Management",
  "School of Commerce, Finance and Accountancy",
  "School of Education",
  "School of Engineering and Technology",
  "School of Humanities and Performing Arts",
  "School of Law",
  "School of Psychological Sciences, Education and Social Work",
  "School of Sciences",
  "School of Social Sciences",
];

let existingEmails: string[] = [];
let existingRegisterNumbers: string[] = [];
let existingPhones: string[] = [];

// Helper function to create the validation schema dynamically
const createTeamSchema = (allTeams: Team[], editingTeamId: string | null) => {
    // When editing, filter out the current team's data from the uniqueness check
    const otherTeams = allTeams.filter(t => t.id !== editingTeamId);
    existingEmails = otherTeams.flatMap(t => t.members.map(m => m.email.toLowerCase()));
    existingRegisterNumbers = otherTeams.flatMap(t => t.members.map(m => m.registerNumber.toLowerCase()));
    existingPhones = otherTeams.flatMap(t => t.members.map(m => m.phone));

    const memberSchema = z.object({
        name: z.string().trim().min(2, "Name must be at least 2 characters."),
        email: z.string().email().trim().refine(val => !existingEmails.includes(val.toLowerCase()), "This email is already registered in another team."),
        phone: z.string().trim().regex(indianPhoneNumberRegex, "Please enter a valid Indian phone number.").refine(val => !existingPhones.includes(val), "This phone number is already registered in another team."),
        registerNumber: z.string().trim().min(1).refine(val => !existingRegisterNumbers.includes(val.toLowerCase()), "This register number is already registered in another team."),
        className: z.string().trim().min(1, "Class is required."),
        department: z.string().trim().min(1, "Department is required."),
        school: z.string().min(1, "Please select a school."),
    });
    
    return z.object({
        teamName: z.string().trim().min(3, "Team name must be at least 3 characters.").refine(async (teamName) => {
            const teamNameExists = allTeams.some(t => t.teamName.toLowerCase() === teamName.toLowerCase() && t.id !== editingTeamId);
            return !teamNameExists;
        }, "This team name is already taken."),
        members: z.array(memberSchema).min(2, "A team must have at least 2 members.").max(5, "A team can have at most 5 members."),
    }).refine(data => {
        const emails = new Set();
        for (const member of data.members) {
            if (emails.has(member.email.toLowerCase())) return false;
            emails.add(member.email.toLowerCase());
        }
        return true;
    }, { message: "Duplicate emails are not allowed within the team.", path: ["members"] })
    .refine(data => {
        const regNos = new Set();
        for (const member of data.members) {
            if (regNos.has(member.registerNumber.toLowerCase())) return false;
            regNos.add(member.registerNumber.toLowerCase());
        }
        return true;
    }, { message: "Duplicate register numbers are not allowed within the team.", path: ["members"] });
};


interface TeamDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Team, 'id'>) => Promise<void>;
    team: Team | null;
    allTeams: Team[];
}

export function TeamDialog({ isOpen, onClose, onSave, team, allTeams }: TeamDialogProps) {
  const [teamSchema, setTeamSchema] = useState(() => createTeamSchema(allTeams, team?.id || null));

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    mode: "onTouched",
    defaultValues: {
        teamName: "",
        members: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });
  
  useEffect(() => {
    // Update the schema when the dialog opens or the team being edited changes
    setTeamSchema(() => createTeamSchema(allTeams, team?.id || null));
  }, [allTeams, team, isOpen]);
  
  useEffect(() => {
    if (team) {
        form.reset(team);
    } else {
        form.reset({ teamName: "", members: [] });
    }
  }, [team, form, isOpen]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof teamSchema>) => {
    await onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>{team ? `Edit Team: ${team.teamName}` : "Add New Team"}</DialogTitle>
                <DialogDescription>
                   Modify the team's details below. Remember to save your changes.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <ScrollArea className="h-[70vh] pr-6">
                        <div className="space-y-6 p-1">
                        <FormField
                            control={form.control}
                            name="teamName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="The Star Gazers" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium mb-2">Members</h3>
                             <div className="space-y-6">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg relative bg-card/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-headline text-lg font-semibold">
                                        {index === 0 ? "Team Lead" : `Member #${index + 1}`}
                                        </h4>
                                        {fields.length > 2 && (
                                        <Button type="button" variant="destructive" size="icon" className="h-7 w-7" onClick={() => remove(index)} disabled={isSubmitting}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <FormField control={form.control} name={`members.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`members.${index}.email`} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`members.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`members.${index}.registerNumber`} render={({ field }) => (<FormItem><FormLabel>Register No.</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`members.${index}.className`} render={({ field }) => (<FormItem><FormLabel>Class</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`members.${index}.department`} render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`members.${index}.school`} render={({ field }) => (<FormItem><FormLabel>School</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent>{schools.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                                    </div>
                                    </div>
                                ))}
                             </div>
                             {form.formState.errors.members && !form.formState.errors.members.root && (
                                <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.members.message}</p>
                            )}
                        </div>

                         {fields.length < 5 && (
                            <Button type="button" variant="outline" onClick={() => append({ name: "", email: "", phone: "", registerNumber: "", className: "", department: "", school: ""})} disabled={isSubmitting}>
                                <UserPlus className="mr-2 h-4 w-4" /> Add Member
                            </Button>
                        )}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
             </Form>
        </DialogContent>
    </Dialog>
  )
}

    