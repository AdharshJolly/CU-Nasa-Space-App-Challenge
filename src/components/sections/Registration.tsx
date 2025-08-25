"use client";

import { XCircle } from "lucide-react";

export function Registration() {
  return (
    <section
      id="register"
      className="py-12 md:py-24 bg-background/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center p-8 max-w-2xl mx-auto rounded-lg bg-card border">
          <XCircle className="h-12 w-12 text-destructive" />
          <h3 className="font-headline text-2xl">
            Registrations for this event have closed.
          </h3>
          <p className="text-muted-foreground">
            Thank you for your interest! If you believe this is a mistake,
            please{" "}
            <a href="#contact" className="text-primary underline">
              contact the coordinators
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
