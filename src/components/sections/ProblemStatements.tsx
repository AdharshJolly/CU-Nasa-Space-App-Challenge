
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SatelliteDish } from "lucide-react";
import { Progress } from '../ui/progress';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ProblemStatement } from '@/components/admin/ProblemStatementDialog';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function ProblemStatements() {
  const [problemsReleased, setProblemsReleased] = useState<boolean | null>(null);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [challengeDomains, setChallengeDomains] = useState<string[]>([]);
  const [progress, setProgress] = useState(13);

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

  return (
    <section id="problems" className="py-12 md:py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">The Challenges</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Tackle real-world problems on Earth and in space using open data from NASA and its partners.
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
          <Card className="text-center bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-lg border-primary/20 border-2 max-w-3xl mx-auto shadow-2xl shadow-primary/10">
             <CardHeader>
                <div className="flex justify-center items-center mb-4">
                    <SatelliteDish className="h-12 w-12 text-primary animate-pulse" />
                </div>
                <CardTitle className="font-headline text-2xl md:text-3xl font-bold text-primary tracking-widest">
                  DECRYPTING TRANSMISSION...
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Challenge data packets are being received. Key domains have been identified. <b>Stay tuned, the full problem statements will be released soon!</b>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {challengeDomains.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-3">
                    {challengeDomains.map(domain => (
                      <Badge key={domain} variant="secondary" className="text-lg py-2 px-4 border-2 border-primary/20 bg-primary/10 text-primary animate-fade-in-up">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Progress value={progress} className="w-full h-4" />
                )}
               <div className="font-code text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div><span className="text-primary">Status:</span> SECURE LINK</div>
                    <div><span className="text-primary">Integrity:</span> 99.8%</div>
                    <div><span className="text-primary">Source:</span> LRO/LCN</div>
                    <div><span className="text-primary">ETA:</span> CLASSIFIED</div>
               </div>
            </CardContent>
          </Card>
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
