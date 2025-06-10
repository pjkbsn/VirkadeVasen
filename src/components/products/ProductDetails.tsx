"use client";

import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductDetailCarousel } from "@/components/common/ProductDetailsCarousel";
import { ProductCard } from "./ProductCard";
import { AddToCartButton } from "../common/AddToCartButton";

type ProductDetailsProps = {
  product: Product | undefined;
  relatedProducts: Product[];
};

export function ProductDetails({
  product,
  relatedProducts,
}: ProductDetailsProps) {
  if (!product) {
    return;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-5">
        <div className="col-span-2">
          {product?.image_url && product.image_url.length > 0 && (
            <ProductDetailCarousel
              images={product.image_url}
              productName={product.product_groups.name}
            />
          )}
        </div>
        <Card className="col-span-1 md:min-h-[650px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-4xl">
              {product?.product_groups?.name}
            </CardTitle>
            <CardDescription>{product?.price}kr</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-10">{product?.product_groups?.description}</p>
            <p>Material: Bomull</p>
            <p>Fyllnad: Polyestervadd</p>
            <p>Storlek: 15x9x7</p>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <p>Färg: </p>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: product?.colors.hex_code }}
              />

              <p>{product?.colors.name}</p>
            </div>
            <p>Kvar i lager: {product?.stock}</p>
          </CardFooter>
          <div className="flex w-full items-center justify-center">
            <AddToCartButton product={product} />
          </div>
        </Card>
      </div>
      {relatedProducts.length > 0 && (
        <div className="flex flex-col items-center mt-30 gap-5">
          <h1 className="font-sans font-bold underline">
            Upptäck liknande väsen
          </h1>
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
              {relatedProducts &&
                relatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.product_groups.name}
                    price={product.price}
                    imageUrl={
                      product.image_url?.length
                        ? product.image_url[0]
                        : "No image available"
                    }
                    colorName={product.colors.name}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
