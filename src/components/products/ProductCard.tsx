import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  colorName?: string;
  height?: string;
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  colorName,
  height,
}: ProductCardProps) {
  return (
    // <div className="w-60">
    <Link href={`/products/${id}`}>
      <Card className="py-0 border-t-0 w-full">
        <div className={`relative aspect-square`}>
          <Image
            src={imageUrl}
            alt={`${name} - ${colorName || ""}`}
            fill={true}
            priority={false}
            sizes="(max-width: 640px) 75vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover rounded-t-xl"
          />
        </div>
        <CardContent className="p-2">
          <CardHeader className="px-0 gap-0">
            <CardTitle className="p-0">
              {name} ({colorName})
            </CardTitle>
            <div className="flex justify-between grow">
              <CardDescription className="flex items-center">
                {price} kr
              </CardDescription>
              <Button variant="outline" className="cursor-pointer">
                <ShoppingCart className="h-12 w-12" />
              </Button>
            </div>
          </CardHeader>
        </CardContent>
        {/* <CardFooter></CardFooter> */}
      </Card>
      {/* <div className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
        <div className="relative aspect-square">

        </div>
        <div className="p-4">
          <h3 className="font-medium">
            
          </h3>
          <p className="font-bold mt-2"></p>
        </div>
      </div> */}
    </Link>
    // </div>
  );
}
