
import React from 'react';
import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/Countdown';
import Link from 'next/link';
import Image from 'next/image';
import FloatingAstronaut from '@/assets/spaceElements/FloatingAstronaut.png'
import AstronautPole from '@/assets/spaceElements/AstronautWithFlagPole.png'
import NasaLogo from "@/assets/logos/nasa.png";
import CULogo from "@/assets/logos/christ_university.png";
import MSFTLogo from "@/assets/logos/msft.png";
import { MapPin, Sparkles } from 'lucide-react';

const sponsors = [
  { name: "CHRIST University", logo: CULogo, hint: "host organization" },
  { name: "NASA", logo: NasaLogo, hint: "space agency" },
  { name: "Microsoft", logo: MSFTLogo, hint: "tech company" },
];

export function Hero() {
  return (
    <section id="hero" className="relative text-center flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background/80 backdrop-blur-sm">
        {/* Animated Starfield */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div id="stars" className="absolute top-0 left-0 w-full h-[2000px] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[move-stars_50s_linear_infinite]"></div>
        </div>
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" 
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
        }}>
      </div>

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <Image
            src={FloatingAstronaut}
            alt="Floating Astronaut"
            width={400}
            height={700}
            className="absolute -left-20 top-1/4 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 opacity-50 md:opacity-80 animate-[float-astronaut_8s_ease-in-out_infinite]"
            data-ai-hint="astronaut"
          />
          <Image
            src={AstronautPole}
            alt="Floating Satellite"
            width={300}
            height={300}
            className="absolute -right-16 bottom-1/4 w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 opacity-40 md:opacity-70 animate-[float-satellite_12s_ease-in-out_infinite_2s]"
            data-ai-hint="satellite"
          />
      </div>


      <div className="container mx-auto px-4 md:px-6 z-20 relative">
        <div className="mb-8">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              {sponsors.map((sponsor, index) => (
                <React.Fragment key={sponsor.name}>
                  <div className="relative h-20 w-auto max-w-48 filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      fill
                      style={{objectFit: "contain"}}
                      data-ai-hint={sponsor.hint}
                    />
                  </div>
                  {index < sponsors.length - 1 && (
                    <span className="text-primary font-bold text-2xl mx-2 hidden md:inline-block">
                      <Sparkles />
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
        </div>

        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4"
            style={{ textShadow: '0 0 15px hsl(var(--primary) / 0.6), 0 0 30px hsl(var(--primary) / 0.4)'}}
        >
          NASA International Space Apps Challenge 2025
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-4">
          Join thousands of innovators across the globe to solve challenges on Earth and in space.
        </p>

        <div className="flex justify-center items-center gap-2 mb-8 text-lg text-primary font-semibold backdrop-blur-sm bg-primary/10 py-2 px-4 rounded-lg border border-primary/20 max-w-md mx-auto">
            <MapPin className="h-5 w-5" />
            <span>CHRIST University, Kengeri Campus</span>
        </div>

        <Countdown />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/40">
            <Link href="#register">Register Now</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="transition-transform duration-300 hover:scale-105">
            <Link href="#problems">View Challenges</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
