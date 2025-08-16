import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const eventName =
  "NASA International Space Apps Challenge 2025 @ CHRIST University";
const eventDescription =
  "Join the world's largest global hackathon! Innovate and solve challenges on Earth and in space using NASA's open data. Hosted at CHRIST (Deemed to be University), Bangalore Kengeri Campus on August 22-23, 2025.";

export const metadata: Metadata = {
  title: {
    default: eventName,
    template: `%s | ${eventName}`,
  },
  description: eventDescription,
  keywords: [
    "NASA Space Apps",
    "Hackathon",
    "CHRIST University",
    "Bangalore",
    "Space",
    "Science",
    "Technology",
    "Innovation",
    "NASA",
    "ISRO",
    "DRDO",
  ],
  openGraph: {
    title: eventName,
    description: eventDescription,
    url: "https://nasa.cuchallenge.live/", // Replace with your actual domain
    siteName: eventName,
    images: [
      {
        url: "https://nasa.cuchallenge.live/og-image.png", // Replace with a link to a preview image
        width: 1200,
        height: 630,
        alt: "NASA Space Apps Challenge Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: eventName,
    description: eventDescription,
    // images: ['https://nasa.cuchallenge.live/twitter-image.png'], // Replace with a link to a twitter-specific image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://nasa.cuchallenge.live/"), // Replace with your actual domain
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A122A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="CHRIST University, NASA Space Apps Team" />
        <meta name="theme-color" content="#0A122A" />
        <link rel="canonical" href="https://nasa.cuchallenge.live/" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
