import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/Countdown';
import Link from 'next/link';

export function Hero() {
  return (
    <section id="hero" className="relative text-center py-20 md:py-32 lg:py-40 flex flex-col items-center overflow-hidden">
        {/* Animated Starfield */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)] animate-[move-stars_150s_linear_infinite]" style={{top: '20%', left: '10%'}}></div>
          <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)] animate-[move-stars_100s_linear_infinite]" style={{top: '50%', left: '80%'}}></div>
          <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)] animate-[move-stars_200s_linear_infinite]" style={{top: '80%', left: '30%'}}></div>
          <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)] animate-[move-stars_120s_linear_infinite]" style={{top: '10%', left: '90%'}}></div>
          <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)] animate-[move-stars_180s_linear_infinite]" style={{top: '60%', left: '60%'}}></div>
          <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)] animate-[move-stars_160s_linear_infinite]" style={{top: '5%', left: '40%'}}></div>
          <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)] animate-[move-stars_130s_linear_infinite]" style={{top: '95%', left: '5%'}}></div>
        </div>
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" 
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
        }}>
      </div>
      <div className="container mx-auto px-4 md:px-6 z-20">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4"
            style={{ textShadow: '0 0 15px hsl(var(--primary) / 0.6), 0 0 30px hsl(var(--primary) / 0.4)'}}
        >
          International Space Apps Challenge 2025
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
          Join thousands of innovators across the globe to solve challenges on Earth and in space.
        </p>
        <Countdown />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
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
