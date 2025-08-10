import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Code, Lightbulb, Users } from "lucide-react";

const perks = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Win Prizes",
      description: "Compete for cash prizes, opportunities, and global recognition.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Network",
      description: "Connect with sponsors, mentors, and fellow space enthusiasts.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Learn & Grow",
      description: "Develop new skills and gain experience with real NASA data.",
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Build Your Portfolio",
      description: "Create a tangible project to showcase to potential employers.",
    },
];

export function Perks() {
  return (
    <section id="perks" className="py-12 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Participant Perks</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            More than just a competition, it's an opportunity to accelerate your journey.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="flex flex-col items-center text-center p-6 bg-background rounded-lg border-2 border-transparent hover:border-primary transition-colors">
              <div className="mb-4">{perk.icon}</div>
              <h3 className="font-headline text-xl font-semibold mb-2">{perk.title}</h3>
              <p className="text-muted-foreground text-sm">{perk.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
