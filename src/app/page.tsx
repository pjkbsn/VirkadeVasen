import { CTASection } from "@/components/sections/home/CTASection";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { OfferingsSection } from "@/components/sections/home/OfferingsSection";

export default function HomePage() {
  return (
    <div className="h-screen snap-y snap-proximity scroll-smooth overflow-y-auto hide-scrollbar">
      <div className="snap-start h-[97vh] relative w-full">
        <HeroSection />
      </div>
      <div className="snap-start min-h-screen relative min-w-screen">
        <OfferingsSection />
      </div>
      <div className="snap-start h-[40vh] w-full">
        <CTASection />
      </div>
    </div>
  );
}
