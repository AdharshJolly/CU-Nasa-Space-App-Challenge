"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Rocket, Trash, UserPlus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

const formSchema = z.object({
  teamName: z.string().min(2, { message: "Team name must be at least 2 characters." }),
  members: z.array(memberSchema).min(2, "You must have at least two members.").max(6, "You can have a maximum of 6 members."),
});

export function Registration() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      members: [
        { name: "", email: "", phone: "" },
        { name: "", email: "", phone: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Registration Successful! 🎉",
      description: "Welcome aboard, astronauts! Check your email for confirmation.",
    });
    form.reset();
  }

  return (
    <section id="register" className="py-12 md:py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-4xl mx-auto bg-card shadow-2xl shadow-primary/10 border-primary/20 border">
          <CardHeader className="text-center p-6 md:p-8">
            <CardTitle className="font-headline text-3xl md:text-4xl">Ready to Launch?</CardTitle>
            <CardDescription className="max-w-2xl mx-auto text-lg pt-2 text-muted-foreground">
                Secure your team's spot at the International Space Apps Challenge 2025. Join a global community of innovators and make your mark on the universe.
            </CardDescription>
             <div className="flex justify-center pt-4">
                <ul className="space-y-2 text-muted-foreground flex flex-col md:flex-row md:space-y-0 md:space-x-6">
                    <li className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" /> Teams of 2 to 6 members
                    </li>
                    <li className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" /> Open to all skill levels
                    </li>
                    <li className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" /> Virtual and in-person events
                    </li>
                </ul>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel className="text-lg font-headline">Team Name</FormLabel>
                      <FormControl>
                          <Input placeholder="The Star Gazers" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                
                <Separator />

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-lg relative bg-card/50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-headline text-lg font-semibold">{index === 0 ? 'Team Lead' : `Team Member #${index + 1}`}</h4>
                        {index > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => remove(index)}
                            >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Remove member</span>
                            </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`members.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl><Input placeholder="Galileo Galilei" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`members.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl><Input type="email" placeholder="star-gazer@galaxy.com" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`members.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl><Input type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col gap-4">
                    {fields.length < 6 && (
                        <Button type="button" variant="outline" onClick={() => append({ name: "", email: "", phone: "" })}>
                            <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
                        </Button>
                    )}
                     {form.formState.errors.members && (
                         <p className="text-sm font-medium text-destructive text-center">{form.formState.errors.members.message || form.formState.errors.members.root?.message}</p>
                     )}


                    <Button type="submit" className="w-full" size="lg">
                        Confirm Registration
                    </Button>
                </div>
            </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
