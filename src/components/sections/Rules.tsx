
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Gavel } from 'lucide-react';

const rules = [
    { 
        title: "Team Formation", 
        content: "Teams can have a minimum of 2 and a maximum of 5 members. You will have to form a team before the event and register." 
    },
    { 
        title: "Project Submission", 
        content: "This is a 24-hour hackathon. All projects must be submitted via the official event platform by the deadline, which is at the completion of the 24 hours. Late submissions will not be accepted." 
    },
    { 
        title: "Code of Conduct", 
        content: "All participants must adhere to the code of conduct prescribe by CHRIST (Demeed to be University). We are committed to providing a safe, respectful, and inclusive environment for everyone. Any violations will be taken seriously." 
    },
    { 
        title: "Originality", 
        content: "All work must be original and created during the hackathon. You may use publicly available libraries and frameworks, but the core of your project must be your own work."
    },
    {
        title: "Use of Data",
        content: "Projects must utilize data from NASA or other space agency partners as specified in the challenge descriptions. The creative and effective use of this data is a key judging criterion."
    }
];


export function Rules() {
  return (
    <section id="rules" className="py-12 md:py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Hackathon Rules</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Please review the official rules to ensure a fair and fun competition for everyone.
            </p>
        </div>
        <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
                {rules.map((rule, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="bg-card/50 backdrop-blur-sm rounded-lg mb-2 px-4 transition-all duration-300 hover:bg-card">
                        <AccordionTrigger className="font-headline text-lg hover:no-underline">
                            <div className="flex items-center gap-3">
                                <Gavel className="h-5 w-5 text-primary"/>
                                {rule.title}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            {rule.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </section>
  );
}
