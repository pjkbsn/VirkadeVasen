"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  colorName: string;
}

export function ProductCard({
  id,
  name,
  colorName,
  imageUrl,
  price,
}: ProductCardProps) {
  return (
    <Card className="py-0 border-t-0 w-full">
      <Link href={`/products/${id}`}>
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
      </Link>
      <CardContent className="p-2 flex flex-col gap-2">
        <CardHeader className="px-0 gap-0">
          <CardTitle className="p-0">
            {name} ({colorName})
          </CardTitle>
          {/* <div className="flex justify-between grow"> */}
          <CardDescription className="flex items-center">
            {price} kr
          </CardDescription>
          {/* </div> */}
        </CardHeader>
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  );
}
