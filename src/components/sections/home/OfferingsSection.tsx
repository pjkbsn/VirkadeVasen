import { getProducts } from "@/actions/products";
import { ProductCarousel } from "@/components/common/ProductCarousel";

export const OfferingsSection = async () => {
  const { data } = await getProducts({ cardView: true, latestAdded: true });

  return (
    <section className="flex flex-col justify-between items-center h-full w-full bg-background py-8 md:py-12">
      <div className="flex justify-end w-full px-4 md:w-10/12 lg:w-8/12">
        <p className="text-foreground text-4xl md:text-6xl lg:text-7xl font-italianno tracking-wider max-w-md">
          Gör ditt hem till en plats där varje rum förtrollas av mystik.
        </p>
      </div>

      <div className="flex flex-col items-center w-full mt-4 md:mt-8">
        <div className="w-full px-4 md:px-12">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-italianno pb-4 md:pb-8">
            Senast tillagda
          </h2>
        </div>
        <div className="w-full">
          <ProductCarousel carouselData={data} />
        </div>
      </div>
    </section>
  );
};
