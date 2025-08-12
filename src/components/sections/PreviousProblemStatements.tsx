
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Domain } from '@/components/admin/DomainDialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import Autoplay from "embla-carousel-autoplay";

export function PreviousProblemStatements() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  
  useEffect(() => {
    const unsubscribeDomains = onSnapshot(query(collection(db, "domains")), (snapshot) => {
        const domainsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Domain[];
        setDomains(domainsData);
    });

    return () => unsubscribeDomains();
  }, []);

  return (
    <section id="previous-problems" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Previous Year's Challenge Domains</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Get inspired by a few of the domains from past events to prepare for this year's challenges.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
            {domains.length > 0 ? (
                <Carousel 
                    opts={{ align: "start", loop: true }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full"
                >
                    <CarouselContent>
                        {domains.map((domain, index) => (
                            <CarouselItem key={index} className="md:basis-1/2">
                                <div className="p-1 h-full">
                                    <Card className="bg-card/50 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm h-full flex flex-col">
                                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0" />
                                            <CardTitle className="font-headline text-lg">
                                              {domain.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">{domain.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
              <p className="text-center text-muted-foreground">Loading previous challenge domains...</p>
            )}
        </div>
      </div>
    </section>
  );
}
