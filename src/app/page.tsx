import { CTASection } from "@/components/sections/home/CTASection";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { OfferingsSection } from "@/components/sections/home/OfferingsSection";

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-proximity hide-scrollbar scroll-smooth">
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
