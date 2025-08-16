import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold text-foreground">
                Space Apps Challenge
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground mb-3">
              Exploring space, one challenge at a time. The largest
              international space and science hackathon.
            </p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Event conducted by Industry Institute Interaction Cell (IIIC) & 
              CHRIST Incubation and Consultancy Foundation (CICF) a CHRIST (Deemed to be University), Bangalore Kengeri Campus
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center md:items-start">
            <h3 className="font-headline text-lg font-semibold">Quick Links</h3>
            <Link
              href="#about"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="#schedule"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Schedule
            </Link>
            <Link
              href="#rules"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Rules
            </Link>
            <Link
              href="#collaborators"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Collaborators
            </Link>
          </div>
          <div className="flex flex-col gap-2 items-center md:items-start">
            <h3 className="font-headline text-lg font-semibold">Engage</h3>
            <p className="text-sm text-muted-foreground">Have a question?</p>
            <Link
              href="#contact"
              className="text-sm font-bold text-primary hover:underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 NASA International Space Apps Challenge. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}