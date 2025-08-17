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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Rocket, Trash, UserPlus } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { generateTeamName } from "@/ai/flows/generate-team-name-flow";
import { logActivity } from "@/lib/logger";

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

// State to hold existing values fetched from the server
let existingEmails: string[] = [];
let existingRegisterNumbers: string[] = [];
let existingPhones: string[] = [];

const memberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required." })
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .min(1, { message: "Email is required." })
    .refine((val) => !existingEmails.includes(val.toLowerCase()), {
      message: "This email is already registered.",
    }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required." })
    .regex(indianPhoneNumberRegex, {
      message: "Please enter a valid 10-digit Indian phone number.",
    })
    .refine((val) => !existingPhones.includes(val), {
      message: "This phone number is already registered.",
    }),
  registerNumber: z
    .string()
    .trim()
    .min(1, { message: "Register number is required." })
    .refine((val) => !existingRegisterNumbers.includes(val.toLowerCase()), {
      message: "This register number is already registered.",
    }),
  className: z.string().trim().min(1, { message: "Class is required." }),
  department: z.string().trim().min(1, { message: "Department is required." }),
  school: z.string().min(1, { message: "Please select a school." }),
});

const formSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(3, { message: "Team name must be at least 3 characters." })
      .max(25, { message: "Team name cannot be more than 25 characters." })
      .refine(
        async (teamName) => {
          if (!teamName) return true;
          const q = query(
            collection(db, "registrations"),
            where("teamName", "==", teamName)
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.empty;
        },
        {
          message: "This team name is already taken. Please choose another.",
        }
      ),
    members: z
      .array(memberSchema)
      .min(2, "You must have at least two members.")
      .max(5, "You can have a maximum of 5 members."),
  })
  .refine(
    (data) => {
      const emails = new Set<string>();
      for (const member of data.members) {
        const lowerEmail = member.email.toLowerCase();
        if (emails.has(lowerEmail)) {
          return false;
        }
        emails.add(lowerEmail);
      }
      return true;
    },
    {
      message: "Each team member must have a unique email address.",
      path: ["members"],
    }
  )
  .refine(
    (data) => {
      const regNos = new Set<string>();
      for (const member of data.members) {
        const lowerRegNo = member.registerNumber.toLowerCase();
        if (regNos.has(lowerRegNo)) {
          return false;
        }
        regNos.add(lowerRegNo);
      }
      return true;
    },
    {
      message: "Each team member must have a unique register number.",
      path: ["members"],
    }
  );

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

export function Registration() {
  const { toast } = useToast();
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await fetch("/api/check-duplicates");
        if (!response.ok) {
          throw new Error("Failed to fetch existing registration data.");
        }
        const data = await response.json();
        existingEmails = data.emails || [];
        existingRegisterNumbers = data.registerNumbers || [];
        existingPhones = data.phones || [];
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Could not load validation data. Please refresh the page.",
        });
      } finally {
        setIsFormReady(true);
      }
    };
    fetchExistingData();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
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

  // const handleGenerateTeamName = async () => {
  //   setIsGeneratingName(true);
  //   try {
  //     const response = await generateTeamName({
  //       nonce: Math.random().toString(36).substring(7),
  //     });
  //     if (response.teamName) {
  //       form.setValue("teamName", response.teamName, { shouldValidate: true });
  //       toast({
  //         title: "Team Name Generated!",
  //         description: `We've called your team "${response.teamName}". Feel free to change it!`,
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Name Generation Failed",
  //       description: "Could not generate a team name. Please try again or enter one manually.",
  //     });
  //   } finally {
  //     setIsGeneratingName(false);
  //   }
  // };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const docRef = await addDoc(collection(db, "registrations"), {
        ...values,
        createdAt: Timestamp.now(),
      });

      // Log the registration activity
      await logActivity(null, "Team Registered", {
        teamName: values.teamName,
        registrationId: docRef.id,
      });

      // Sync to Google Sheet automatically (fire-and-forget)
      fetch("/api/sync-to-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamData: values }),
      }).catch((error) => {
        // Optional: log error to console or a logging service if the background sync fails
        console.error("Background sync to sheet failed:", error);
      });

      setIsSuccessDialogOpen(true);
      form.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          "There was a problem saving your registration. Please try again.",
      });
    }
  }

  const isSubmitDisabled = isSubmitting || !isFormReady;

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
                Secure your team's spot! This event is exclusively for students
                of CHRIST (Deemed to be University). Join innovators from your
                university and make your mark.
              </CardDescription>

              <div className="mt-4 max-w-2xl mx-auto text-base text-primary/80 bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="font-bold">Please Note:</p>
                <p>
                  A registration fee of{" "}
                  <b className="text-primary">₹500 per team</b> is required to
                  cover your snacks and other amenities. Your team's
                  registration will only be confirmed after the payment is made.
                  Payment details will be sent to the team lead's email.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <ul className="space-y-2 text-muted-foreground flex flex-col md:flex-row md:space-y-0 md:space-x-6">
                  <li className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" /> Teams of 2 to 5
                    members
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" /> Open to all
                    skill levels
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" /> In-person events
                  </li>
                </ul>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {!isFormReady && (
                <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <h3 className="font-headline text-2xl">
                    Preparing Launchpad...
                  </h3>
                  <p className="text-muted-foreground">
                    Syncing with registration servers to prevent duplicate
                    entries.
                  </p>
                </div>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={`space-y-8 ${!isFormReady ? "hidden" : ""}`}
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
                                disabled={isSubmitDisabled || isGeneratingName}
                              />
                            </FormControl>
                          </div>
                          {/* <Button
                            type="button"
                            variant="secondary"
                            onClick={handleGenerateTeamName}
                            disabled={isSubmitDisabled || isGeneratingName}
                          >
                            {isGeneratingName ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              "Generate a Name"
                            )}
                          </Button> */}
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
                              disabled={isSubmitDisabled}
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
                                    disabled={isSubmitDisabled}
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
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="galileo.g@example.com"
                                    {...field}
                                    disabled={isSubmitDisabled}
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
                                    disabled={isSubmitDisabled}
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
                                    disabled={isSubmitDisabled}
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
                                    disabled={isSubmitDisabled}
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
                                    disabled={isSubmitDisabled}
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
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={isSubmitDisabled}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a school" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {schools.map((school) => (
                                      <SelectItem key={school} value={school}>
                                        {school}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
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
                        disabled={isSubmitDisabled}
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
                      disabled={isSubmitDisabled}
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
      <AlertDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center items-center mb-4">
              <Rocket className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-headline">
              Registration Submitted!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Welcome aboard, astronauts! Your registration is provisionally
              complete. To finalize your spot, the team lead must complete the
              payment.
              <br />
              <br />
              <b>Next Step:</b> Please check the team lead's email inbox for a
              message containing payment instructions and a link to the planning
              portal. There might be a slight delay in receiving this email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsSuccessDialogOpen(false)}
              className="w-full"
            >
              Roger That!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
