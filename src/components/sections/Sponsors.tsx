import Image from "next/image";

const sponsors = [
  { name: "NASA", logo: "https://placehold.co/200x100.png", hint: "space agency" },
  { name: "SpaceX", logo: "https://placehold.co/200x100.png", hint: "rocket company" },
  { name: "ESA", logo: "https://placehold.co/200x100.png", hint: "space agency" },
  { name: "Google Cloud", logo: "https://placehold.co/200x100.png", hint: "tech company" },
  { name: "JAXA", logo: "https://placehold.co/200x100.png", hint: "space agency" },
  { name: "AWS", logo: "https://placehold.co/200x100.png", hint: "cloud provider" },
];

export function Sponsors() {
  return (
    <section id="sponsors" className="py-12 md:py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Sponsors</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Powering the next generation of space innovation. We're grateful for their support.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="relative h-16 w-40 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 transform hover:scale-110">
              <Image
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                layout="fill"
                objectFit="contain"
                data-ai-hint={sponsor.hint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
