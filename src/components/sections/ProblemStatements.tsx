
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, SatelliteDish } from "lucide-react";
import { Progress } from '../ui/progress';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ProblemStatement } from '@/components/admin/ProblemStatementDialog';

export function ProblemStatements() {
  const [problemsReleased, setProblemsReleased] = useState<boolean | null>(null);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
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

    return () => {
      settingsUnsubscribe();
      problemsUnsubscribe();
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
                  Challenge data packets are being received from a secure NASA channel. Decryption is in progress.
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
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {problems.length > 0 ? problems.map((problem) => (
                <Card key={problem.id} className="flex flex-col bg-card/50 backdrop-blur-sm hover:border-primary border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
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
            )) : (
              <p className="text-center text-muted-foreground md:col-span-2">No challenges have been added yet. Please check back later.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
