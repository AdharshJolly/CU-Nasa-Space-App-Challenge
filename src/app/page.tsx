
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Schedule } from "@/components/sections/Schedule";
import { Rules } from "@/components/sections/Rules";
import { Perks } from "@/components/sections/Perks";
import { ProblemStatements } from "@/components/sections/ProblemStatements";
import { Collaborators } from "@/components/sections/Collaborators";
import { Registration } from "@/components/sections/Registration";
import { Contact } from "@/components/sections/Contact";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { LiveUpdatesBanner } from "@/components/layout/LiveUpdatesBanner";
import { PreviousProblemStatements } from "@/components/sections/PreviousProblemStatements";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default async function Home() {
  let problemsReleased = false;
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "features"));
    if (settingsDoc.exists()) {
      problemsReleased = settingsDoc.data().problemsReleased;
    }
  } catch (error) {
    console.error("Could not fetch settings from Firestore in build time.", error);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background bg-grid-pattern">
      <LiveUpdatesBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimateOnScroll>
          <About />
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
        {!problemsReleased && (
            <AnimateOnScroll>
              <PreviousProblemStatements />
            </AnimateOnScroll>
        )}
        <AnimateOnScroll>
          <Registration />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Collaborators />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Contact />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
