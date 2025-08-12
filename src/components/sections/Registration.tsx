
"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Rocket, Trash, UserPlus, Wand2 } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateTeamName } from "@/ai/flows/generate-team-name-flow";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(indianPhoneNumberRegex, {
    message: "Please enter a valid 10-digit Indian phone number.",
  }),
  registerNumber: z
    .string()
    .min(1, { message: "Register number is required." }),
  className: z.string().min(1, { message: "Class is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  school: z.string().min(1, { message: "School is required." }),
});

const formSchema = z
  .object({
    teamName: z
      .string()
      .min(3, { message: "Team name must be at least 3 characters." })
      .max(25, { message: "Team name cannot be more than 25 characters." }),
    members: z
      .array(memberSchema)
      .min(2, "You must have at least two members.")
      .max(5, "You can have a maximum of 5 members."),
  })
  .refine(
    async (data) => {
      const q = query(
        collection(db, "registrations"),
        where("teamName", "==", data.teamName)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    },
    {
      message: "This team name is already taken. Please choose another.",
      path: ["teamName"],
    }
  )
  .refine(async (data, ctx) => {
    const emails = data.members.map((m) => m.email);
    const q = query(
      collection(db, "registrations"),
      where(
        "members",
        "array-contains-any",
        data.members.map((m) => ({
          email: m.email,
          name: m.name,
          phone: m.phone,
          registerNumber: m.registerNumber,
          className: m.className,
          department: m.department,
          school: m.school,
        }))
      )
    );
    const querySnapshot = await getDocs(q);

    const existingEmails: string[] = [];
    querySnapshot.forEach((doc) => {
      doc.data().members.forEach((member: { email: string }) => {
        if (emails.includes(member.email)) {
          existingEmails.push(member.email);
        }
      });
    });

    let hadError = false;
    data.members.forEach((member, index) => {
      if (existingEmails.includes(member.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "This email is already registered.",
          path: [`members`, index, "email"],
        });
        hadError = true;
      }
    });

    return !hadError;
  });

export function Registration() {
  const { toast } = useToast();
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      members: [
        {
          name: "",
          email: "",
          phone: "",
          registerNumber: "",
          className: "",
          department: "",
          school: "",
        },
        {
          name: "",
          email: "",
          phone: "",
          registerNumber: "",
          className: "",
          department: "",
          school: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addDoc(collection(db, "registrations"), values);
      setIsSuccessDialogOpen(true);
      form.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          "There was a problem registering your team. Please try again.",
      });
    }
  }

  const handleGenerateName = async () => {
    setIsGeneratingName(true);
    try {
      const { teamName } = await generateTeamName({
        nonce: String(Math.random()),
      });
      form.setValue("teamName", teamName, { shouldValidate: true });
      toast({
        title: "Team Name Generated!",
        description: `We've called you "${teamName}". Feel free to change it!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate a team name. Please try again.",
      });
    } finally {
      setIsGeneratingName(false);
    }
  };

  return (
    <>
      <section
        id="register"
        className="py-12 md:py-24 bg-background/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-4xl mx-auto bg-card shadow-2xl shadow-primary/10 border-primary/20 border">
            <CardHeader className="text-center p-6 md:p-8">
              <CardTitle className="font-headline text-3xl md:text-4xl">
                Ready to Launch?
              </CardTitle>
              <CardDescription className="max-w-2xl mx-auto text-lg pt-2 text-muted-foreground">
                Secure your team's spot! This event is exclusively for students of CHRIST (Deemed to be University). Join innovators from your university and make your mark.
              </CardDescription>

              <div className="mt-4 max-w-2xl mx-auto text-base text-primary/80 bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="font-bold">Please Note:</p>
                <p>A registration fee of <b className="text-primary">₹500 per team</b> is required to cover food expenses. After submitting this form, the team lead will receive an email with payment details.</p>
              </div>

              <div className="flex justify-center pt-4">
                <ul className="space-y-2 text-muted-foreground flex flex-col md:flex-row md:space-y-0 md:space-x-6">
                  <li className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" /> Teams of 2 to 5
                    members
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" /> Open to all skill
                    levels
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" /> In-person events
                  </li>
                </ul>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                          <div className="flex-grow">
                            <FormLabel className="text-lg font-headline">
                              Team Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="The Star Gazers"
                                {...field}
                                disabled={isSubmitting || isGeneratingName}
                              />
                            </FormControl>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGenerateName}
                            disabled={isSubmitting || isGeneratingName}
                          >
                            {isGeneratingName ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Generate Name
                              </>
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="space-y-4 p-4 border rounded-lg relative bg-card/50"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-headline text-lg font-semibold">
                            {index === 0
                              ? "Team Lead"
                              : `Team Member #${index + 1}`}
                          </h4>
                          {index > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => remove(index)}
                              disabled={isSubmitting}
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
                                <FormControl>
                                  <Input
                                    placeholder="Galileo Galilei"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`members.${index}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CHRIST Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="galileo.g@btech.christuniversity.in"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
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
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name={`members.${index}.registerNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Register Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="222XXXX"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`members.${index}.className`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Class</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. 3BTECH-CS"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`members.${index}.department`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. Computer Science"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`members.${index}.school`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. School of Engineering"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    {fields.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({
                            name: "",
                            email: "",
                            phone: "",
                            registerNumber: "",
                            className: "",
                            department: "",
                            school: "",
                          })
                        }
                        disabled={isSubmitting}
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
                      </Button>
                    )}
                    {form.formState.errors.members && (
                      <p className="text-sm font-medium text-destructive text-center">
                        {form.formState.errors.members.message ||
                          form.formState.errors.members.root?.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Confirm Registration"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
      <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center items-center mb-4">
                <Rocket className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-headline">Registration Submitted!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Welcome aboard, astronauts! Your registration is provisionally complete. 
              To finalize your spot, the team lead must complete the payment.
              <br/><br/>
              <b>Next Step:</b> Please check the team lead's email inbox for a message containing payment instructions and a link to the planning portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)} className="w-full">
                Roger That!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
