import { CheckCircle } from 'lucide-react';

const timelineEvents = [
    {
        date: "September 30, 2025",
        title: "Registration Closes",
        description: "Final day to register your team. Don't miss the deadline to be part of this amazing event!"
    },
    {
        date: "October 1, 2025",
        title: "Problem Statements Release",
        description: "The official challenges from NASA and partner space agencies are unveiled. Start brainstorming!"
    },
    {
        date: "October 10, 2025",
        title: "Hackathon Kickoff",
        description: "The event officially begins with our opening ceremony, keynotes, and team formation sessions."
    },
    {
        date: "October 10-12, 2025",
        title: "The Hackathon",
        description: "Two full days of intense hacking, creating, and collaborating. Mentors will be available to help you."
    },
    {
        date: "October 12, 2025 - 12:00 PM",
        title: "Project Submissions Due",
        description: "All projects must be submitted. Make sure to include your source code and a video demo."
    },
    {
        date: "October 12, 2025 - 02:00 PM",
        title: "Judging & Demos",
        description: "Teams present their projects to our panel of judges. This is your chance to shine!"
    },
    {
        date: "October 12, 2025 - 05:00 PM",
        title: "Awards & Closing Ceremony",
        description: "Winning teams are announced, and we celebrate the achievements of all participants."
    }
];

export function Schedule() {
    return (
        <section id="schedule" className="py-12 md:py-24 bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Event Timeline</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        From registration to the final frontier, here are the key dates for your mission.
                    </p>
                </div>
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>
                    {timelineEvents.map((event, index) => (
                        <div key={index} className="relative mb-12">
                            <div className="flex items-center">
                                <div className={`w-1/2 pr-8 text-right`}>
                                   {index % 2 === 0 && (
                                     <div className="bg-background p-6 rounded-lg border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                                        <p className="text-primary font-bold">{event.date}</p>
                                        <h3 className="font-headline text-xl font-semibold mt-1">{event.title}</h3>
                                        <p className="text-muted-foreground text-sm mt-2">{event.description}</p>
                                     </div>
                                   )}
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-card">
                                   <CheckCircle className="text-primary-foreground h-5 w-5" />
                                </div>
                                 <div className={`w-1/2 pl-8 text-left`}>
                                     {index % 2 !== 0 && (
                                         <div className="bg-background p-6 rounded-lg border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                                            <p className="text-primary font-bold">{event.date}</p>
                                            <h3 className="font-headline text-xl font-semibold mt-1">{event.title}</h3>
                                            <p className="text-muted-foreground text-sm mt-2">{event.description}</p>
                                         </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
