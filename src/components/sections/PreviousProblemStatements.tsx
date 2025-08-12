
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, SatelliteDish } from "lucide-react";
import { Progress } from '../ui/progress';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ProblemStatement } from '@/components/admin/ProblemStatementDialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import Autoplay from "embla-carousel-autoplay";


export function PreviousProblemStatements() {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  
  useEffect(() => {
    // This is a simplified fetch for previous problems. In a real app, you might fetch this from a static JSON file or a specific "previous_problems" collection.
    const staticProblems: ProblemStatement[] = [
        { id: "prev-1", title: "Global Fire Monitoring", category: "Earth Observation", description: "Develop a system to monitor and predict the spread of wildfires using satellite imagery and climate data." },
        { id: "prev-2", title: "Lunar Rover Navigation", category: "Space Exploration", description: "Create an algorithm to help a rover navigate autonomously on the lunar surface, avoiding obstacles and conserving energy." },
        { id: "prev-3", title: "Space Debris Tracker", category: "Robotics & Automation", description: "Design a solution to track and visualize orbital debris in real-time to help prevent satellite collisions." },
        { id: "prev-4", title: "Life Support Systems", category: "Human Spaceflight", description: "Conceptualize a closed-loop life support system for a long-duration mission to Mars, focusing on water recycling and air revitalization." },
    ];
    setProblems(staticProblems);
  }, []);

  return (
    <section id="previous-problems" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Previous Year's Challenges</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Get inspired by challenges from the past to prepare for this year's event.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
            {problems.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-2">
                {problems.map((problem) => (
                    <AccordionItem value={problem.id} key={problem.id} className="bg-card/50 backdrop-blur-sm rounded-lg px-4 border-b-0 hover:bg-card transition-colors">
                        <AccordionTrigger className="font-headline text-lg hover:no-underline text-left">
                            <div className="flex flex-col gap-1">
                                <span className='text-primary text-sm'>{problem.category}</span>
                                <span>{problem.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            {problem.description}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            ) : (
            <p className="text-center text-muted-foreground">Loading previous challenges...</p>
            )}
        </div>
      </div>
    </section>
  );
}
