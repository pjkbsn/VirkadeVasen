import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "../products/ProductCard";

type ProductCarouselProps = {
  carouselData: Product[];
};

export const ProductCarousel = ({ carouselData }: ProductCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-end">
        {/* Column 1: Navigation arrows */}
        <div className="w-2/12 flex items-center ">
          <div className="inline-flex h-10 translate-x-15 -translate-y-5 md:translate-y-0 md:translate-x-15">
            <CarouselPrevious className="h-10 w-10 bg-background text-foreground rounded-lg cursor-pointer">
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext className="h-10 w-10 bg-background text-foreground rounded-lg cursor-pointer">
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </div>
        </div>

        {/* Column 2: Carousel content */}
        <CarouselContent className="w-screen h-full">
          {carouselData.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-4 basis-1/1 sm:basis-1/2 lg:basis-1/4"
            >
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.product_groups.name}
                price={item.price}
                imageUrl={
                  item.image_url?.length
                    ? item.image_url[0]
                    : "No image available"
                }
                colorName={item.colors.name}
                // height="96"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
};
