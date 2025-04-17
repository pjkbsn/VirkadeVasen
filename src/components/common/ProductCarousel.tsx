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
      className="grid grid-cols-[auto_1fr] items-center gap-4 w-full h-auto md:h-[25rem] lg:h-[30rem]"
    >
      {/* Column 1: Navigation arrows */}
      <div className="col-start-1 flex flex-col justify-center gap-4 w-20 bg-black ">
        <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 bg-white hover:bg-gray-100 text-black">
          <ChevronLeft className="h-5 w-5" />
        </CarouselPrevious>
        <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 bg-white hover:bg-gray-100 text-black">
          <ChevronRight className="h-5 w-5" />
        </CarouselNext>
      </div>

      {/* Column 2: Carousel content */}
      <CarouselContent className="col-start-2 h-full">
        {carouselItems.map((item) => (
          <CarouselItem
            key={item.id}
            className="pl-4 md:basis-1/3 lg:basis-1/4 h-full"
          >
            <div className="p-1 h-full">
              <Card className="h-full md:h-[25rem] lg:h-[30rem]">
                <CardContent className="flex p-0 h-full">
                  <div className="w-full h-full">
                    {/* Use a placeholder or your actual images */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-black">
                      {item.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
