import { getProducts } from "@/actions/products";
import { ProductCarousel } from "@/components/common/ProductCarousel";

export const OfferingsSection = async () => {
  const { data } = await getProducts({ cardView: true, latestAdded: true });

  return (
    <section className="flex flex-col justify-between items-center h-screen w-full bg-background py-4 md:py-6">
      {/* Top quote - reduced text size */}
      <div className="flex justify-end w-full px-4 md:w-10/12 lg:w-8/12">
        <p className="text-foreground text-2xl md:text-4xl lg:text-5xl font-italianno tracking-wider max-w-md">
          Gör ditt hem till en plats där varje rum förtrollas av mystik.
        </p>
      </div>

      {/* Bottom carousel - minimized spacing */}
      <div className="flex flex-col items-center w-full mt-1 md:mt-2">
        <div className="w-full px-4 md:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-italianno pb-3 text-right md:text-left">
            Senast tillagda
          </h2>
        </div>
        <div className="w-full h-full">
          {" "}
          {/* Fixed height for carousel */}
          <ProductCarousel carouselData={data} />
        </div>
      </div>
    </section>
  );
};
