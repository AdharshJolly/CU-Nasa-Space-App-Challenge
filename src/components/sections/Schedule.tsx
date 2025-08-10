import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from 'lucide-react';

const schedule = {
    "Day 1: Kickoff": [
        { time: "09:00 AM", event: "Registration & Breakfast" },
        { time: "10:00 AM", event: "Opening Ceremony & Keynote" },
        { time: "11:00 AM", event: "Team Formation & Ideation" },
        { time: "12:00 PM", event: "Hackathon Begins!" },
        { time: "01:00 PM", event: "Lunch" },
        { time: "06:00 PM", event: "Tech Talk by NASA Engineer" },
        { time: "08:00 PM", event: "Dinner" },
    ],
    "Day 2: Hacking": [
        { time: "All Day", event: "Hacking & Mentor Sessions" },
        { time: "09:00 AM", event: "Breakfast" },
        { time: "01:00 PM", event: "Lunch & Project Check-in" },
        { time: "07:00 PM", event: "Dinner & Workshop on Pitching" },
        { time: "10:00 PM", event: "Late Night Snacks & Fun Activity" },
    ],
    "Day 3: Finale": [
        { time: "09:00 AM", event: "Breakfast" },
        { time: "12:00 PM", event: "Hacking Ends & Submissions Due" },
        { time: "01:00 PM", event: "Lunch" },
        { time: "02:00 PM", event: "Project Demos & Judging" },
        { time: "05:00 PM", event: "Awards & Closing Ceremony" },
        { time: "06:00 PM", event: "Networking & Celebration" },
    ]
};

export function Schedule() {
    return (
        <section id="schedule" className="py-12 md:py-24 bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Event Timeline</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Follow the journey from kickoff to the final frontier of project demos.
                    </p>
                </div>
                <div className="grid gap-12 md:grid-cols-3">
                    {Object.entries(schedule).map(([day, events]) => (
                        <div key={day} className="relative pl-8">
                             <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-4"></div>
                            <h3 className="font-headline text-2xl font-bold mb-6">{day}</h3>
                            <div className="space-y-6">
                                {events.map((item, index) => (
                                    <div key={index} className="relative flex items-start">
                                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 ml-4 border-4 border-card"></div>
                                        <div className="pl-6">
                                            <p className="font-bold text-primary">{item.time}</p>
                                            <p className="font-medium text-foreground">{item.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
