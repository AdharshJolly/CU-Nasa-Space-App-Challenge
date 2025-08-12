
"use client";

import React from "react";
import Link from "next/link";
import { Rocket, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import SpaceAppLogo from "@/assets/logos/space_app_logo.png";
import CULogo from "@/assets/logos/christ_university.png";
import { Separator } from "../ui/separator";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "#problems", label: "Problems" },
  { href: "#collaborators", label: "Collaborators" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-sm border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative h-14 w-36">
            <Image
              src={SpaceAppLogo}
              alt="NASA Space Apps Challenge Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="relative h-18 w-44">
            <Image
              src={CULogo}
              alt="CHRIST University Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="#register">Register Now</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 p-6 text-lg font-medium">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <Rocket className="h-7 w-7 text-primary" />
                    <span className="font-headline text-2xl font-bold text-foreground">
                      Space Apps Challenge
                    </span>
                  </Link>
                </SheetClose>
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <Button asChild className="mt-4">
                  <SheetClose asChild>
                    <Link href="#register">Register Now</Link>
                  </SheetClose>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
