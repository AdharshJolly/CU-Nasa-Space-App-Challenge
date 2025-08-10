
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Schedule } from "@/components/sections/Schedule";
import { Rules } from "@/components/sections/Rules";
import { Perks } from "@/components/sections/Perks";
import { ProblemStatements } from "@/components/sections/ProblemStatements";
import { Sponsors } from "@/components/sections/Sponsors";
import { Speakers } from "@/components/sections/Speakers";
import { Registration } from "@/components/sections/Registration";
import { Contact } from "@/components/sections/Contact";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background bg-grid-pattern">
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimateOnScroll>
          <About />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Speakers />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Schedule />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Rules />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Perks />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ProblemStatements />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Sponsors />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Registration />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Contact />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
