"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rocket } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["developer", "designer", "scientist", "engineer", "student", "other"]),
});

export function Registration() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Registration Successful! 🎉",
      description: "Welcome aboard, astronaut! Check your email for confirmation.",
    });
    form.reset();
  }

  return (
    <section id="register" className="py-12 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to Launch?</h2>
                <p className="text-muted-foreground text-lg">
                    Secure your spot at the International Space Apps Challenge 2025. Join a global community of innovators and make your mark on the universe.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" /> Free to participate
                    </li>
                    <li className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" /> Open to all skill levels
                    </li>
                    <li className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" /> Virtual and in-person events
                    </li>
                </ul>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-2xl">
                <h3 className="font-headline text-2xl font-bold mb-4 text-center">Register Now</h3>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Galileo Galilei" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="star-gazer@galaxy.com" {...field} />
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
                            <FormLabel>Primary Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="designer">Designer</SelectItem>
                                <SelectItem value="scientist">Scientist</SelectItem>
                                <SelectItem value="engineer">Engineer</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <Button type="submit" className="w-full" size="lg">
                        Confirm Registration
                    </Button>
                </form>
                </Form>
            </div>
        </div>
      </div>
    </section>
  );
}
