
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


export function ProblemStatements() {
  const [problemsReleased, setProblemsReleased] = useState<boolean | null>(null);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [challengeDomains, setChallengeDomains] = useState<string[]>([]);
  const [progress, setProgress] = useState(13);
  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));


  useEffect(() => {
    const settingsUnsubscribe = onSnapshot(doc(db, "settings", "features"), (doc) => {
        if (doc.exists()) {
            setProblemsReleased(doc.data().problemsReleased);
        } else {
            setProblemsReleased(false);
        }
    });

    const problemsUnsubscribe = onSnapshot(query(collection(db, "problems")), (snapshot) => {
        const problemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProblemStatement[];
        setProblems(problemsData);
    });

    const domainsUnsubscribe = onSnapshot(doc(db, "settings", "challengeDomains"), (doc) => {
      if (doc.exists() && doc.data().domains) {
        setChallengeDomains(doc.data().domains.split(',').map((d: string) => d.trim()).filter((d: string) => d));
      } else {
        setChallengeDomains([]);
      }
    });

    return () => {
      settingsUnsubscribe();
      problemsUnsubscribe();
      domainsUnsubscribe();
    }
  }, []);


  useEffect(() => {
    if (problemsReleased) return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + Math.random() * 5));
    }, 2000);
    return () => clearInterval(timer);
  }, [problemsReleased]);

  const renderNotReleased = () => {
    if (challengeDomains.length > 0) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <Carousel
            plugins={[autoplayPlugin.current]}
            className="w-full"
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
            opts={{
              loop: true,
            }}
          >
             <CarouselContent>
                {challengeDomains.map((domain) => (
                  <CarouselItem key={domain} className="md:basis-1/2">
                    <div className="p-1">
                      <Card className="bg-card/50 backdrop-blur-sm border-primary/20 border-2 shadow-lg shadow-primary/10">
                        <CardHeader className="flex flex-col items-center text-center gap-4">
                            <Lightbulb className="h-10 w-10 text-primary" />
                            <CardTitle className="font-headline text-2xl">{domain}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            This is one of the key domains for this year's challenge. Start thinking about what you can build!
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
             </CarouselContent>
             <CarouselPrevious />
             <CarouselNext />
          </Carousel>
        </div>
      );
    }

    return (
       <Card className="text-center bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-lg border-primary/20 border-2 max-w-3xl mx-auto shadow-2xl shadow-primary/10">
         <CardHeader>
            <div className="flex justify-center items-center mb-4">
                <SatelliteDish className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <CardTitle className="font-headline text-2xl md:text-3xl font-bold text-primary tracking-widest">
              DECRYPTING TRANSMISSION...
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2 max-w-md mx-auto">
              Challenge data packets are being received. Stay tuned, the full problem statements will be released soon!
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Progress value={progress} className="w-full h-4" />
           <div className="font-code text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-2">
                <div><span className="text-primary">Status:</span> SECURE LINK</div>
                <div><span className="text-primary">Integrity:</span> 99.8%</div>
                <div><span className="text-primary">Source:</span> LRO/LCN</div>
                <div><span className="text-primary">ETA:</span> CLASSIFIED</div>
           </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section id="problems" className="py-12 md:py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">The Challenges</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {problemsReleased ? "Tackle real-world problems on Earth and in space using open data from NASA and its partners." : "The challenge domains are being revealed. Get ready for liftoff!"}
          </p>
        </div>
        {problemsReleased === null ? (
            <Card className="text-center bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-lg border-primary/20 border-2 max-w-3xl mx-auto shadow-2xl shadow-primary/10">
                <CardHeader>
                     <div className="flex justify-center items-center mb-4">
                        <SatelliteDish className="h-12 w-12 text-primary animate-pulse" />
                     </div>
                     <CardTitle className="font-headline text-2xl md:text-3xl font-bold">CONNECTING TO HQ...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Checking for latest challenge data...</p>
                </CardContent>
            </Card>
        ) : !problemsReleased ? (
          renderNotReleased()
        ) : (
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
              <p className="text-center text-muted-foreground">No challenges have been added yet. Please check back later.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
