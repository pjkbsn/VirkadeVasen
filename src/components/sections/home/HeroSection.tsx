import Header from "@/components/layout/header";
// import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="h-[95vh] w-full relative overflow-hidden">
      <Header />
      <div className="absolute inset-0">
        <Image
          src="/omslag.jpg"
          alt="Hero background"
          fill
          quality={90}
          className="object-cover brightness-65"
          priority
        />
      </div>
      {/* Content Container */}
      <div className="relative z-10 grid grid-cols-[minmax(10rem,auto)_1fr_minmax(10rem,auto)] grid-rows-[auto_1fr_auto] h-full p-4 md:p-6">
        {/* Title - aligned center but won't overlap with logo */}
        <div className="col-start-2 row-start-1 text-center self-center">
          <h1 className="font-italianno text-white text-3xl md:text-5xl lg:text-9xl">
            Virkadeväsen
          </h1>
        </div>
        {/* Middle content - Takes full height of row */}
        <div className="col-start-2 row-start-2 flex flex-col items-center justify-center text-white px-4">
          <p className="font-italianno text-xl md:text-5xl lg:text-9xl mb-8 text-center">
            En plats av magi
          </p>
          {/* <Button variant="default" className="cursor-pointer">
            Se alla väsen
          </Button> */}
        </div>

        {/* Empty div to balance the layout */}

        <div className="col-start-2 row-start-3 flex items-center justify-center text-white self-center">
          <ArrowDown className="h-12 w-12 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
