import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductDetailCarousel = {
  images: string[];
  productName: string;
};

export const ProductDetailCarousel = ({
  images,
  productName,
}: ProductDetailCarousel) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const onChange = () => {
      setCurrent(api.selectedScrollSnap());

      // Sync thumbnail carousel
      if (thumbnailApi) {
        thumbnailApi.scrollTo(api.selectedScrollSnap());
      }
    };

    api.on("select", onChange);
    return () => {
      api.off("select", onChange);
    };
  }, [api, thumbnailApi]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          No images available
        </div>
      </div>
    );
  }

  // If only one image, just show it without carousel controls
  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/3]">
        <Image
          src={images[0]}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-top rounded-sm"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          dragFree: false,
        }}
      >
        <CarouselContent className="ml-0">
          {images.map((image, index) => (
            <CarouselItem key={index} className="relative aspect-[4/3]">
              <Image
                src={image}
                alt={`${productName} - Image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain object-top rounded-sm"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-y-1/2 left-15 z-10">
          <CarouselPrevious className="h-8 w-8 opacity-70 hover:opacity-100 hover:cursor-pointer" />
        </div>
        <div className="absolute inset-y-1/2 right-15 z-10">
          <CarouselNext className="h-8 w-8 opacity-70 hover:opacity-100 hover:cursor-pointer" />
        </div>
      </Carousel>

      <Carousel
        setApi={setThumbnailApi}
        opts={{
          containScroll: "keepSnaps",
          dragFree: false,
          watchDrag: false,
          skipSnaps: false,
          inViewThreshold: 1.0,
        }}
        className="w-full mt-1"
      >
        <CarouselContent className="flex gap-4 mx-auto">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="basis-1/5 min-w-0 pl-0 md:basis-1/6"
            >
              <button
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border-2",
                  current === index ? "border-primary" : "border-transparent"
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 20vw, 10vw"
                  className="object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
