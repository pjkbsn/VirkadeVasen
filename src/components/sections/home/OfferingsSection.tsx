import { ProductCarousel } from "@/components/common/ProductCarousel";

export const OfferingsSection = () => {
  return (
    <section className="bg-white h-screen w-full">
      <div className="grid grid-rows-[1fr_1fr] h-full p-4 md:p-6 lg:p-8 gap-4">
        <div className="row-start-1 grid grid-cols-[1fr_1fr]">
          <div className=" col-start-1 flex items-end justify-end">
            <h1 className="text-3xl text-black text-left w-70 md:w-120 md:text-5xl lg:text-8xl lg:w-[33rem]">
              Välkommen till hemmet för magiska väsen
            </h1>
          </div>
          <p className=" text-black col-start-2 flex items-end w-40">
            Gör ditt hem till en plats där varje rum förtrollas av mystik
          </p>
        </div>
        <div className="row-start-2 w-full flex items-center justify-end">
          <ProductCarousel />
        </div>
      </div>
    </section>
  );
};
