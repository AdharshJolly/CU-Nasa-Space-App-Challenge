import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CalendarDays, Users } from "lucide-react";

const aboutItems = [
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: "Venue",
    description: "CHRIST University Kengeri Campus",
  },
  {
    icon: <CalendarDays className="h-8 w-8 text-primary" />,
    title: "Date",
    description: "August 22-23, 2025",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Participants",
    description:
      "Coders, scientists, designers, storytellers, makers, builders, and technologists.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="py-12 md:py-24 bg-background/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            About the Event
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            The NASA International Space Apps Challenge is a hackathon for
            creatives and technologists around the world to work with NASA's
            free and open data.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {aboutItems.map((item, index) => (
            <Card
              key={index}
              className="bg-card/50 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-col items-center text-center gap-4">
                {item.icon}
                <CardTitle className="font-headline text-2xl">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
