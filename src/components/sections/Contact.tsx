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
import Adharsh from "@/assets/co-ordinators/adharsh.jpg";
import Vishnu from "@/assets/co-ordinators/vishnu.jpg";
import Annemarie from "@/assets/co-ordinators/annemarie.jpg";

const facultyCoordinators = [
  {
    name: "Dr. Joseph Rodrigues",
    hint: "man portrait",
    avatar:
      "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E2394.jpg",
    email: "joseph.rodrigues@christuniversity.in",
  },
  {
    name: "Ms. Minu Narayanan",
    hint: "woman portrait",
    email: "minu.narayanan@christuniversity.in",
  },
  {
    name: "Dr. Manikandan P",
    hint: "man portrait",
    avatar:
      "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E1162.jpg",
    email: "manikandan.p@christuniversity.in",
  },
  {
    name: "Dr. Hari Murthy",
    hint: "man portrait",
    avatar:
      "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E2996.jpg",
    email: "hari.murthy@christuniversity.in",
  },
  {
    name: "Dr. Santhrupth B C",
    hint: "man portrait",
    avatar:
      "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E5873.jpg",
    email: "santhrupth.bc@christuniversity.in",
  },
  {
    name: "Dr. Albert Joseph Hefferan",
    hint: "man portrait",
    avatar:
      "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E4871.jpg",
    email: "albertjoseph.hefferan@christuniversity.in",
  },
  {
    name: "Dr. Benson K Money",
    hint: "man portrait",
    avatar:
      "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E1757.jpg",
    email: "benson.money@christuniversity.in",
  },
  {
    name: "Col. Sudhir M R",
    hint: "man portrait",
    avatar:
      "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E2411.jpg",
    email: "colonel.sudhir@christuniversity.in",
  },
];

const studentCoordinators = [
  {
    name: "Manoj Reddy",
    avatar: Manoj.src,
    hint: "man portrait",
    email: "m.manoj@btech.christuniversity.in",
    phone: "+918618627856",
  },
  {
    name: "Vishnu Nambiar",
    avatar: Vishnu.src,
    hint: "man portrait",
    email: "vishnu.nambiar@btech.christuniversity.in",
    phone: "+918848799780",
  },
  {
    name: "Adharsh Jolly",
    avatar: Adharsh.src,
    hint: "man portrait",
    email: "adharsh.jolly@btech.christuniversity.in",
    phone: "+919431703182",
  },
  {
    name: "Annmarie Vinish",
    avatar: Annemarie.src,
    hint: "woman portrait",
    email: "annmarie.vinish@btech.christuniversity.in",
    phone: "+918921323033",
  },
];

const CoordinatorCard = ({
  name,
  avatar,
  hint,
  email,
  phone,
}: {
  name: string;
  avatar?: string;
  hint: string;
  email: string;
  phone?: string;
}) => (
  <Card className="text-center flex flex-col items-center p-6 bg-card/50 backdrop-blur-sm hover:border-primary border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
    <Avatar className="w-24 h-24 mb-4 border-4 border-transparent group-hover:border-primary transition-all">
      <AvatarImage src={avatar} alt={name} data-ai-hint={hint} />
      <AvatarFallback>{name.split(" ")[1][0]}</AvatarFallback>
    </Avatar>
    <CardTitle className="font-headline text-xl">{name}</CardTitle>
    <CardContent className="mt-4 flex flex-col gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={`mailto:${email}`}>
          <Mail className="mr-2" /> Email
        </a>
      </Button>
      {phone && (
        <Button variant="outline" size="sm" asChild>
          <a href={`tel:${phone}`}>
            <Phone className="mr-2" /> Call
          </a>
        </Button>
      )}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {facultyCoordinators.map((person) => (
                <CoordinatorCard key={person.name} {...person} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-headline font-bold text-center mb-8 text-primary">
              Student Coordinators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
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
