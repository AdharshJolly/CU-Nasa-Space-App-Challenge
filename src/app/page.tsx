
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

const facultyCoordinators = [
  { name: "Dr. Joseph Rodrigues", email: "joseph.rodrigues@christuniversity.in" },
  { name: "Ms. Minu Narayanan", email: "minu.narayanan@christuniversity.in" },
  { name: "Dr. Manikandan P", email: "manikandan.p@christuniversity.in" },
  { name: "Dr. Hari Murthy", email: "hari.murthy@christuniversity.in" },
  { name: "Dr. Albert Joseph Hefferan", email: "albertjoseph.hefferan@christuniversity.in" },
  { name: "Dr. Benson K Money", email: "benson.money@christuniversity.in" },
  { name: "Col. Sudhir M R", email: "colonel.sudhir@christuniversity.in" },
];

const studentCoordinators = [
  { name: "Manoj Reddy", email: "m.manoj@btech.christuniversity.in", phone: "+918618627856" },
  { name: "Vishnu Nambiar", email: "vishnu.nambiar@btech.christuniversity.in", phone: "+918848799780" },
  { name: "Adharsh Jolly", email: "adharsh.jolly@btech.christuniversity.in", phone: "+919431703182" },
  { name: "Annmarie Vinish", email: "annmarie.vinish@btech.christuniversity.in", phone: "+918921323033" },
];

const allCoordinators = [...facultyCoordinators, ...studentCoordinators];

const generateEventSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Hackathon",
    "name": "NASA International Space Apps Challenge 2025 at CHRIST University",
    "description": "The NASA International Space Apps Challenge is a 24-hour global hackathon where teams of technologists, scientists, designers, artists, educators, entrepreneurs, developers, and students collaborate and engage with publicly available data to design and build innovative solutions for global challenges.",
    "startDate": "2025-08-22T10:00:00+05:30",
    "endDate": "2025-08-23T18:00:00+05:30",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "CHRIST (Deemed to be University), Bangalore Kengeri Campus",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Mysore Rd, Kanmanike, Kumbalgodu",
        "addressLocality": "Bengaluru",
        "postalCode": "560074",
        "addressRegion": "Karnataka",
        "addressCountry": "IN"
      }
    },
    "image": [
      "https://nasa.cuchallenge.live/og-image.png"
    ],
    "organizer": {
      "@type": "Organization",
      "name": "CHRIST (Deemed to be University)",
      "url": "https://christuniversity.in/"
    },
    "performer": allCoordinators.map(coord => ({
      "@type": "Person",
      "name": coord.name,
      "jobTitle": coord.phone ? "Student Coordinator" : "Faculty Coordinator",
      "email": coord.email,
      "telephone": coord.phone || undefined,
    })),
    "offers": {
      "@type": "Offer",
      "price": "500",
      "priceCurrency": "INR",
      "url": "https://nasa.cuchallenge.live/#register",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-06-01T00:00:00+05:30"
    },
    "url": "https://nasa.cuchallenge.live/"
  };
  return JSON.stringify(schema);
};

export default async function Home() {
  let problemsReleased = false;
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "features"));
    if (settingsDoc.exists()) {
      problemsReleased = settingsDoc.data().problemsReleased;
    }
  } catch (error) {
    console.error(
      "Could not fetch settings from Firestore in build time.",
      error
    );
  }

  const jsonLd = generateEventSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
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
            <Contact />
          </AnimateOnScroll>
          <AnimateOnScroll>
            <Collaborators />
          </AnimateOnScroll>
        </main>
        <Footer />
      </div>
    </>
  );
}
