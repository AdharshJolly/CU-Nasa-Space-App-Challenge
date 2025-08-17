import Image from "next/image";

const collaborators = [
  {
    name: "NASA",
    logo: "/assets/logos/nasa.png",
    hint: "United States government agency for space exploration and aeronautics",
  },
  {
    name: "SUMVN",
    logo: "/assets/logos/sumvn.png",
    hint: "Domain name and web services provider",
  },
  {
    name: "Telengana Government",
    logo: "/assets/logos/govt_telangana.png",
    hint: "State government of Telangana, India",
  },
  {
    name: "RICH",
    logo: "/assets/logos/rich.png",
    hint: "Research and Innovation Circle of Hyderabad, fostering innovation and entrepreneurship",
  },
  {
    name: "Microsoft",
    logo: "/assets/logos/msft.png",
    hint: "Global technology company, software and cloud solutions",
  },
  {
    name: "Microsoft AI Innovators Hub",
    logo: "/assets/logos/msft_innovators.png",
    hint: "Microsoft initiative supporting AI innovation and startups",
  },
  {
    name: "Women Innovators",
    logo: "/assets/logos/women_innovator.png",
    hint: "Platform supporting women entrepreneurs and innovators",
  },
  {
    name: "Dhruva",
    logo: "/assets/logos/dhruva.png",
    hint: "Indian private space technology company, satellite and launch solutions",
  },
  {
    name: "Outshade",
    logo: "/assets/logos/outshade.png",
    hint: "Digital transformation and technology solutions company",
  },
  {
    name: "Vishva",
    logo: "/assets/logos/vishva.png",
    hint: "Technology company",
  },
  {
    name: "AIC DSU",
    logo: "/assets/logos/aic_dsu.png",
    hint: "Startup incubator at Dayananda Sagar University",
  },
];

export function Collaborators() {
  return (
    <section id="collaborators" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            In collaboration with
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Powering the next generation of space innovation. We're grateful for
            their support.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {collaborators.map((sponsor) => (
            <div
              key={sponsor.name}
              className="relative h-32 min-w-44 transition-all duration-300 transform hover:scale-110"
            >
              <Image
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                fill
                style={{ objectFit: "contain" }}
                data-ai-hint={sponsor.hint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
