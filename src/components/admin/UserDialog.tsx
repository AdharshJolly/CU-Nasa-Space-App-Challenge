
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { AppUser } from "@/app/admin/dashboard/page";

export const USER_ROLES = ["superadmin", "admin", "faculty", "volunteer", "poc"] as const;
export type UserRole = typeof USER_ROLES[number];

const userSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    role: z.enum(USER_ROLES, {
        required_error: "Please select a role for the user.",
    }),
});


interface UserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: z.infer<typeof userSchema>) => Promise<void>;
    user: AppUser | null;
}

export function UserDialog({ isOpen, onClose, onSave, user }: UserDialogProps) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
        email: "",
        role: "volunteer",
    }
  });
  
  useEffect(() => {
    if (isOpen) {
        if (user) {
            form.reset({
                email: user.email,
                role: user.role,
            });
        } else {
            form.reset({ email: "", role: "volunteer" });
        }
    }
  }, [user, form, isOpen])

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    await onSave(values);
    if (!form.formState.isSubmitSuccessful) {
        return;
    }
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isSubmitting) onClose() }}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{user ? "Edit User" : "Add or Import User"}</DialogTitle>
                <DialogDescription>
                    {user 
                        ? "Update the user's role." 
                        : "Create a new user or assign a role to an existing user. New users will receive an email to set their password."}
                </DialogDescription>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} disabled={isSubmitting || !!user} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {USER_ROLES.map(role => (
                                            <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save User
                        </Button>
                    </DialogFooter>
                </form>
             </Form>
        </DialogContent>
    </Dialog>
  )
}
