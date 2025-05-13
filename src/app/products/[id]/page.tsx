"use client";

import { useProducts } from "@/hooks/useProducts";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductVariant } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductDetailCarousel } from "@/components/common/ProductDetailsCarousel";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductDetails() {
  const [product, setProduct] = useState<ProductVariant | null>(null);
  const [allVariants, setAllVariants] = useState<ProductVariant[] | null>(null);
  const { getProduct, loading, error, getAllProductVariants } = useProducts();
  const { id } = useParams();

  console.log("Product: ", product);
  console.log("Product hexcolor: ", product?.colors.hex_code);
  console.log("Alla varianter: ", allVariants);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);
      console.log("Data: ", data);
      if (data) {
        setProduct(data);
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchVariants = async () => {
      if (product?.products.id) {
        const data = await getAllProductVariants(product?.products.id);
        console.log("Alla varianter inuti useEffect: ", data);
        if (data) {
          const filteredData = data.filter((p) => p.id !== product.id);
          // console.log("Filtered data: ", filteredData);
          setAllVariants(filteredData);
        }
      }
    };
    fetchVariants();
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p>Error: {typeof error === "string" ? error : error.message}</p>;

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-5">
        <div className="col-span-2">
          {product?.image_url && product.image_url.length > 0 && (
            <ProductDetailCarousel
              images={product.image_url}
              productName={product.products.name}
            />
          )}
        </div>
        <Card className="col-span-1 md:min-h-[650px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-4xl">{product?.products.name}</CardTitle>
            <CardDescription>{product?.price}kr</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-10">{product?.products.description}</p>
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

              {/* <p>{product?.colors.name}</p> */}
            </div>
            <p>Kvar i lager: {product?.stock}</p>
            Antal: -incoming clicker-
          </CardFooter>
          <div className="flex w-full items-center justify-center">
            <Button className="w-3/4">Lägg i varukorg</Button>
          </div>
        </Card>
      </div>
      <div className="flex flex-col items-center mt-30 gap-5">
        <h1 className="font-sans font-bold underline">
          Upptäck mer väsen i samma färg
        </h1>
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
            {allVariants &&
              allVariants.length > 0 &&
              allVariants.map((variant) => (
                <ProductCard
                  key={variant.id}
                  id={variant.id}
                  name={variant.products.name}
                  price={variant.price}
                  imageUrl={
                    variant.image_url?.length
                      ? variant.image_url[0]
                      : "No image available"
                  }
                  colorName={variant.colors.name}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
