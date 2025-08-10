import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const speakers = [
  {
    name: "Dr. Evelyn Reed",
    title: "Astrophysicist, NASA JPL",
    avatar: "https://placehold.co/128x128.png",
    hint: "woman portrait"
  },
  {
    name: "Marco Chen",
    title: "Lead Engineer, SpaceX",
    avatar: "https://placehold.co/128x128.png",
    hint: "man portrait"
  },
  {
    name: "Aisha Adebayo",
    title: "Climate Scientist, ESA",
    avatar: "https://placehold.co/128x128.png",
    hint: "woman scientist"
  },
  {
    name: "Kenji Tanaka",
    title: "Robotics Expert, JAXA",
    avatar: "https://placehold.co/128x128.png",
    hint: "man engineer"
  },
];

export function Speakers() {
  return (
    <section id="speakers" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Featured Speakers</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Insights from the brightest minds in space exploration and technology.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <div key={speaker.name} className="flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                <AvatarImage src={speaker.avatar} alt={speaker.name} data-ai-hint={speaker.hint} />
                <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-headline text-xl font-semibold">{speaker.name}</h3>
              <p className="text-primary">{speaker.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
