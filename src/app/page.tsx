import { LiveUpdateBanner } from "@/components/layout/LiveUpdateBanner";
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

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LiveUpdateBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Speakers />
        <Schedule />
        <Rules />
        <Perks />
        <ProblemStatements />
        <Sponsors />
        <Registration />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
