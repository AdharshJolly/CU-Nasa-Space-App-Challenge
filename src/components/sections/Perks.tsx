
import { Award, Code, Lightbulb, Users } from "lucide-react";

const perks = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Qualify for Nationals",
      description: "Top teams get the chance to compete at the national level.",
      detailedDescription: "The winning teams from our event will be nominated for the next level: NASA Space Apps national level, putting your project on a national stage. Qualifying teams will be given an opportunity for felicitation at the Microsoft Campus. Projects that meet NASA's standards have a chance to win a seeding fund of up to ₹25 crores."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Network",
      description: "Connect with sponsors, mentors, and fellow space enthusiasts.",
      detailedDescription: "Engage with industry experts from leading tech companies, space agencies and defence organisations like ISRO, DRDO, Microsoft, Roscosmos, JAXA, etc and collaborate with talented peers who share your passion."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Learn & Grow",
      description: "Develop new skills and gain experience with real NASA data.",
      detailedDescription: "Participate in workshops, get mentorship from professionals and experts from ISRO and DRDO, and learn to work with massive datasets from NASA, ISRO, enhancing your technical and problem-solving skills."
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Build Your Portfolio",
      description: "Create a tangible project to showcase to potential employers.",
      detailedDescription: "You'll leave with a fully-fledged project for your resume or portfolio, demonstrating your ability to build a real-world application under a deadline."
    },
];

export function Perks() {
  return (
    <section id="perks" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Participant Perks</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            More than just a competition, it's an opportunity to accelerate your journey.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="group relative overflow-hidden rounded-lg border-2 border-transparent bg-card p-6 text-center transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
              <div className="flex flex-col items-center">
                <div className="mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
                  {perk.icon}
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">{perk.title}</h3>
                <p className="text-muted-foreground text-sm">{perk.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 translate-y-full transform bg-card/80 p-6 backdrop-blur-sm transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                  <h3 className="font-headline text-xl font-semibold mb-2 text-primary">{perk.title}</h3>
                  <p className="text-sm text-foreground">{perk.detailedDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
