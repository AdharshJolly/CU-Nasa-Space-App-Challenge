
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
import type { AppUser } from "@/app/admin/page";

export const USER_ROLES = ["superadmin", "admin", "faculty", "volunteer", "poc"] as const;
export type UserRole = typeof USER_ROLES[number];

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

const userSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    role: z.enum(USER_ROLES, {
        required_error: "Please select a role for the user.",
    }),
    phone: z.string().optional(),
}).refine(data => {
    // Mandatory for volunteer and poc
    if ((data.role === 'volunteer' || data.role === 'poc') && (!data.phone || !indianPhoneNumberRegex.test(data.phone))) {
        return false;
    }
    // Optional for others, but if provided, must be valid
    if (data.phone && data.phone.length > 0 && !indianPhoneNumberRegex.test(data.phone)) {
        return false;
    }
    return true;
}, {
    message: "A valid Indian phone number is required for Volunteers and POCs. For other roles, it must be valid if provided.",
    path: ["phone"],
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
        phone: ""
    }
  });
  
  useEffect(() => {
    if (isOpen) {
        if (user) {
            form.reset({
                email: user.email,
                role: user.role,
                phone: user.phone || ""
            });
        } else {
            form.reset({ email: "", role: "volunteer", phone: "" });
        }
    }
  }, [user, form, isOpen])

  const { isSubmitting } = form.formState;
  const watchedRole = form.watch("role");

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    // Only pass the phone if the role needs it.
    const dataToSave = {
        ...values,
        phone: (watchedRole !== 'faculty' && values.phone) ? values.phone : undefined
    };
    await onSave(dataToSave);
    if (!form.formState.isSubmitSuccessful) {
        return;
    }
    form.reset();
  };
  
  const phoneFieldLabel = () => {
    if (watchedRole === 'volunteer' || watchedRole === 'poc') {
      return "Phone Number (Mandatory)";
    }
    return "Phone Number (Optional)";
  }

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
                    {watchedRole !== 'faculty' && (
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{phoneFieldLabel()}</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="+91 98765 43210" {...field} disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
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
