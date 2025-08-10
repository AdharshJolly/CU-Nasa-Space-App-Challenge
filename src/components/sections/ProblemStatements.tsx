import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const comingSoon = true; // Set to false when problems are released

const problems = [
    { title: "Orbital Debris Mitigation", category: "Space Exploration", description: "Design a novel solution to track, manage, or remove orbital debris to ensure the safety of current and future space missions." },
    { title: "Earth Climate Data Visualization", category: "Earth Science", description: "Develop an interactive tool to visualize complex climate datasets, making them accessible and understandable to the public." },
    { title: "Lunar Habitat Challenge", category: "Deep Space", description: "Conceptualize and design a sustainable habitat for the first long-term human settlement on the Moon." },
    { title: "AI for Asteroid Detection", category: "Planetary Defense", description: "Create an AI/ML model that can analyze telescope imagery to identify and classify near-Earth asteroids more effectively." },
];

export function ProblemStatements() {
  return (
    <section id="problems" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">The Challenges</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Tackle real-world problems on Earth and in space using open data from NASA and its partners.
          </p>
        </div>
        {comingSoon ? (
          <div className="text-center bg-card p-12 rounded-lg">
            <h3 className="font-headline text-2xl font-bold text-primary">Problem Statements Coming Soon!</h3>
            <p className="text-muted-foreground mt-2">
              Stay tuned! We'll be releasing the official challenges closer to the event date.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {problems.map((problem) => (
                <Card key={problem.title} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline">{problem.title}</CardTitle>
                        <CardDescription className="text-primary font-semibold">{problem.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{problem.description}</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" /> Select Challenge
                        </Button>
                    </CardFooter>
                </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
