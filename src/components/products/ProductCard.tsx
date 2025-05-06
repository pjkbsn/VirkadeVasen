import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

export const ProductCard = () => {
  return (
    <Card className="w-70 h-90 grid grid-rows-2 border-0 shadow-none">
      <CardHeader>
        <Image
          src="/cat.jpg"
          alt="Cat"
          width={250}
          height={250}
          quality={90}
          className="object-scale-down"
        />
      </CardHeader>
      <div className="mt-3.5">
        <CardContent>Virkade väsen</CardContent>
        <CardFooter className="flex justify-between">
          <p>Katt(svart)</p> <p>350kr</p>
        </CardFooter>
      </div>
    </Card>
  );
};
