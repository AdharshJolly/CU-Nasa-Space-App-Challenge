
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

export const USER_ROLES = ["admin", "faculty", "volunteer", "poc"] as const;
export type UserRole = typeof USER_ROLES[number];

const userSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    password: z.string().optional(),
    role: z.enum(USER_ROLES, {
        required_error: "Please select a role for the user.",
    }),
}).refine(data => {
    // If there's no user (we're creating), password is required
    if (!data.email.includes('@') && data.password && data.password.length < 6) {
        return false;
    }
    return true;
}, {
    message: "Password must be at least 6 characters long.",
    path: ["password"],
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
        password: "",
        role: "volunteer",
    }
  });
  
  useEffect(() => {
    if (user) {
        form.reset({
            email: user.email,
            role: user.role,
            password: ""
        });
    } else {
        form.reset({ email: "", password: "", role: "volunteer" });
    }
  }, [user, form, isOpen])

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    await onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isSubmitting) onClose() }}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                    {user ? "Update the user's role." : "Create a new user with a specific role."}
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
                    {!user && (
                         <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
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
