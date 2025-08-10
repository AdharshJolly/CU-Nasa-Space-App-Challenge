
"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TimelineEvent } from '@/components/admin/TimelineEventDialog';
import { format } from 'date-fns';


export function Schedule() {
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    
    useEffect(() => {
        const q = query(collection(db, "timeline"), orderBy("date"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TimelineEvent[];
            setTimelineEvents(eventsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section id="schedule" className="py-12 md:py-24 bg-background/80 backdrop-blur-sm">
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
                        <div key={event.id} className="relative mb-12">
                            <div className="flex items-center">
                                <div className={`w-1/2 pr-8 text-right`}>
                                   {index % 2 === 0 && (
                                     <div className="bg-card p-6 rounded-lg border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                                        <p className="text-primary font-bold">{format(new Date(event.date), "PPP")}</p>
                                        <h3 className="font-headline text-xl font-semibold mt-1">{event.title}</h3>
                                        <p className="text-muted-foreground text-sm mt-2">{event.description}</p>
                                     </div>
                                   )}
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-background">
                                   <CheckCircle className="text-primary-foreground h-5 w-5" />
                                </div>
                                 <div className={`w-1/2 pl-8 text-left`}>
                                     {index % 2 !== 0 && (
                                         <div className="bg-card p-6 rounded-lg border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                                            <p className="text-primary font-bold">{format(new Date(event.date), "PPP")}</p>
                                            <h3 className="font-headline text-xl font-semibold mt-1">{event.title}</h3>
                                            <p className="text-muted-foreground text-sm mt-2">{event.description}</p>
                                         </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {timelineEvents.length === 0 && (
                        <p className="text-center text-muted-foreground">The event timeline is being finalized. Check back soon!</p>
                    )}
                </div>
            </div>
        </section>
    );
}
