import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProductCarousel = () => {
  const carouselItems = [
    { id: 1, content: "Item 1" },
    { id: 2, content: "Item 2" },
    { id: 3, content: "Item 3" },
    { id: 4, content: "Item 4" },
    { id: 5, content: "Item 5" },
    { id: 6, content: "Item 6" },
    { id: 7, content: "Item 7" },
  ];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
      }}
      className="w-350"
    >
      <CarouselContent className="-ml-4">
        {carouselItems.map((item) => (
          <CarouselItem
            key={item.id}
            className="pl-4 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <div className="relative w-full h-full">
                    {/* Use a placeholder or your actual images */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-black">
                      {item.content}
                      {/* Uncomment when you have images
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                      />
                      */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute top-2/2 -left-30 transform -translate-y-1/2 bg-black text-black border border-gray-200 rounded-full p-2 focus:ring-2 focus:ring-gray-200 focus:outline-none">
          <ChevronLeft className="h-5 w-5" />
        </CarouselPrevious>
        <CarouselNext className="absolute top-2/2 -left-20 transform -translate-y-1/2 bg-black text-black border border-gray-200 rounded-full p-2 focus:ring-2 focus:ring-gray-200 focus:outline-none">
          <ChevronRight className="h-5 w-5" />
        </CarouselNext>
      </div>
    </Carousel>
  );
};
