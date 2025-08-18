
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

export const USER_VERTICALS = [
    "Inauguration & Valedictory",
    "Registration",
    "Guest/Jury Shadow",
    "Hackathon - On Ground",
    "Logistics",
    "Media",
    "Documentation & IT",
] as const;
export type UserVertical = typeof USER_VERTICALS[number];

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

const userSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    role: z.enum(USER_ROLES, {
        required_error: "Please select a role for the user.",
    }),
    phone: z.string().optional(),
    vertical: z.string().optional(),
}).refine(data => {
    // Phone validation
    const needsPhone = data.role === 'volunteer' || data.role === 'poc' || data.role === 'admin' || data.role === 'superadmin';
    const isPhoneMandatory = data.role === 'volunteer' || data.role === 'poc';

    if (isPhoneMandatory && (!data.phone || !indianPhoneNumberRegex.test(data.phone))) {
        return false;
    }
    if (data.phone && needsPhone && !indianPhoneNumberRegex.test(data.phone)) {
        return false;
    }
    return true;
}, {
    message: "A valid Indian phone number is required for Volunteers and POCs. For other roles, it must be valid if provided.",
    path: ["phone"],
}).refine(data => {
    // Vertical validation
    const needsVertical = data.role === 'volunteer' || data.role === 'poc';
    if (needsVertical && !data.vertical) {
        return false;
    }
    return true;
}, {
    message: "A vertical is required for Volunteers and POCs.",
    path: ["vertical"],
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
        phone: "",
        vertical: "",
    }
  });
  
  useEffect(() => {
    if (isOpen) {
        if (user) {
            form.reset({
                email: user.email,
                role: user.role,
                phone: user.phone || "",
                vertical: user.vertical || "",
            });
        } else {
            form.reset({ email: "", role: "volunteer", phone: "", vertical: "" });
        }
    }
  }, [user, form, isOpen])

  const { isSubmitting } = form.formState;
  const watchedRole = form.watch("role");

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    // Only pass the phone/vertical if the role needs it.
    const dataToSave = {
        ...values,
        phone: (watchedRole !== 'faculty' && values.phone) ? values.phone : undefined,
        vertical: (watchedRole === 'volunteer' || watchedRole === 'poc') ? values.vertical : undefined,
    };
    await onSave(dataToSave as any);
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

  const showPhoneField = watchedRole === 'volunteer' || watchedRole === 'poc' || watchedRole === 'admin' || watchedRole === 'superadmin';
  const showVerticalField = watchedRole === 'volunteer' || watchedRole === 'poc';


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isSubmitting) onClose() }}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{user ? "Edit User" : "Add or Import User"}</DialogTitle>
                <DialogDescription>
                    {user 
                        ? "Update the user's role and details." 
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
                    {showPhoneField && (
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
                    {showVerticalField && (
                        <FormField
                            control={form.control}
                            name="vertical"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vertical (Mandatory)</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a vertical" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {USER_VERTICALS.map(v => (
                                                <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
