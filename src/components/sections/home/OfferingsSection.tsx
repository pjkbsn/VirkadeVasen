import { getProducts } from "@/actions/products";
import { ProductCarousel } from "@/components/common/ProductCarousel";

export const OfferingsSection = async () => {
  const { data } = await getProducts({ cardView: true, latestAdded: true });

  return (
    <section className="flex flex-col justify-evenly items-center min-h-screen min-w-screen p-10 bg-background">
      <div className="flex justify-end w-8/12">
        <p className="text-foreground flex w-4/12 md:text-7xl font-italianno  tracking-wider">
          Gör ditt hem till en plats där varje rum förtrollas av mystik.
        </p>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="max-sm:flex grid grid-cols-5 w-full">
          <h2 className="text-6xl sm:col-start-1 sm:text-7xl md:text-8xl font-italianno pb-10 mr-12 md:col-start-2 col-span-5">
            Senast tillagda
          </h2>
        </div>
        <ProductCarousel carouselData={data} />
      </div>
    </section>
  );
};
