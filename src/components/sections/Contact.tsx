"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import Manoj from "@/assets/co-ordinators/manoj.jpeg";

const facultyCoordinators = [
  {
    name: "Dr. Joseph Rodriguez",
    role: "Faculty Advisor",
    avatar: "https://placehold.co/100x100.png",
    hint: "woman portrait",
    email: "evelyn.reed@example.com",
    phone: "+1-202-555-0181",
  },
  {
    name: "Dr. Ben Carter",
    role: "Logistics & Operations",
    avatar: "https://placehold.co/100x100.png",
    hint: "man portrait",
    email: "ben.carter@example.com",
    phone: "+1-202-555-0193",
  },
];

const studentCoordinators = [
  {
    name: "Manoj Reddy",
    role: "Head Student Coordinator",
    avatar: Manoj.src || Manoj,
    hint: "man portrait",
    email: "m.manoj@btech.christuniversity.in",
    phone: "+918618627856",
  },
  {
    name: "Leo Martinez",
    role: "Technical Support Lead",
    avatar: "https://placehold.co/100x100.png",
    hint: "man portrait",
    email: "leo.martinez@example.com",
    phone: "+1-202-555-0162",
  },
  {
    name: "Samantha Chen",
    role: "Participant Liason",
    avatar: "https://placehold.co/100x100.png",
    hint: "woman portrait",
    email: "samantha.chen@example.com",
    phone: "+1-202-555-0178",
  },
];

const CoordinatorCard = ({
  name,
  role,
  avatar,
  hint,
  email,
  phone,
}: {
  name: string;
  role: string;
  avatar: any;
  hint: string;
  email: string;
  phone: string;
}) => (
  <Card className="text-center flex flex-col items-center p-6 bg-card/50 backdrop-blur-sm hover:border-primary border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
    <Avatar className="w-24 h-24 mb-4 border-4 border-transparent group-hover:border-primary transition-all">
      <AvatarImage src={avatar} alt={name} data-ai-hint={hint} />
      <AvatarFallback>
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <CardTitle className="font-headline text-xl">{name}</CardTitle>
    <CardDescription>{role}</CardDescription>
    <CardContent className="mt-4 flex flex-col gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={`mailto:${email}`}>
          <Mail className="mr-2" /> Email
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`tel:${phone}`}>
          <Phone className="mr-2" /> Call
        </a>
      </Button>
    </CardContent>
  </Card>
);

export function Contact() {
  return (
    <section id="contact" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Contact Us
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Have a question or need assistance? Reach out to our coordination
            team.
          </p>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-headline font-bold text-center mb-8 text-primary">
              Faculty Coordinators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {facultyCoordinators.map((person) => (
                <CoordinatorCard key={person.name} {...person} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-headline font-bold text-center mb-8 text-primary">
              Student Coordinators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {studentCoordinators.map((person) => (
                <CoordinatorCard key={person.name} {...person} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
