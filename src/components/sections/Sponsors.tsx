import Image from "next/image";
import NasaLogo from "@/assets/logos/nasa.png";
import SumvnLogo from "@/assets/logos/sumvn.png";
import TelenganaGovtLogo from "@/assets/logos/govt_telangana.png";
import RichLogo from "@/assets/logos/rich.png";
import MSFTLogo from "@/assets/logos/msft.png";
import MSFTInnovatorsLogo from "@/assets/logos/msft_innovators.png";
import WomenInnovatorLogo from "@/assets/logos/women_innovator.png";
import DhruvaLogo from "@/assets/logos/dhruva.png";
import OutshadeLogo from "@/assets/logos/outshade.png";
import VishvaLogo from "@/assets/logos/vishva.png";
import AICLogo from "@/assets/logos/aic_dsu.png";

const sponsors = [
  { name: "NASA", logo: NasaLogo, hint: "space agency" },
  { name: "SUMVN", logo: SumvnLogo, hint: "rocket company" },
  { name: "Telengana Govt", logo: TelenganaGovtLogo, hint: "space agency" },
  { name: "RICH", logo: RichLogo, hint: "tech company" },
  {
    name: "Microsoft",
    logo: MSFTLogo,
    hint: "space agency",
  },
  {
    name: "AI Innovators Hub",
    logo: MSFTInnovatorsLogo,
    hint: "cloud provider",
  },
  {
    name: "Women Innovators",
    logo: WomenInnovatorLogo,
    hint: "cloud provider",
  },
  {
    name: "Dhruva",
    logo: DhruvaLogo,
    hint: "cloud provider",
  },
  {
    name: "Outshade",
    logo: OutshadeLogo,
    hint: "cloud provider",
  },
  {
    name: "Vishva",
    logo: VishvaLogo,
    hint: "cloud provider",
  },
  {
    name: "AIC DSU",
    logo: AICLogo,
    hint: "cloud provider",
  },
];

export function Sponsors() {
  return (
    <section id="sponsors" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Our Sponsors
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Powering the next generation of space innovation. We're grateful for
            their support.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {sponsors.map((sponsor) => (
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
