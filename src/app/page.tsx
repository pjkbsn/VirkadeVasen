import { CTASection } from "@/components/sections/home/CTASection";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { OfferingsSection } from "@/components/sections/home/OfferingsSection";

export default function HomePage() {
  return (
    <div className="h-screen hide-scrollbar snap-y snap-proximity scroll-smooth">
      <div className="snap-start w-full">
        <HeroSection />
      </div>
      <div className="snap-start w-full">
        <OfferingsSection />
      </div>
      <div className="snap-start w-full">
        <CTASection />
      </div>
    </div>
  );
}
