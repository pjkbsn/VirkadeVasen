"use client";

import { ProductForm } from "@/components/admin/products/ProductForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";
import { VariantForm } from "@/components/admin/products/VariantForm";
import { useProductFormStore } from "@/store/productform-store";
// import { getServerProducts } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default async function NewProductPage() {
  const [products, setProducts] = useState<Product[] | []>([]);
  const { getProductsBasic } = useProducts();
  const {
    productId,
    isCreatingVariant,
    setProductId,
    setIsCreatingVariant,
    reset,
  } = useProductFormStore();

  useEffect(() => {
    reset();
  }, [reset]);

  // const { success, data: serverProducts, error } = await getServerProducts();

  // console.log("Fetched Serverproducts: ", serverProducts);

  const handleValueChange = (value: string) => {
    if (value === "clear-option") {
      setProductId("");
    } else {
      setProductId(value);
    }
  };

  console.log("Is creating variant: ", isCreatingVariant);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProductsBasic();
      if (data) {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="mx-auto p-6">
      {!isCreatingVariant && !productId && (
        <>
          <h1>Vad vill du skapa?</h1>
          <Select value={productId} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Välj befintlig produkt" />
            </SelectTrigger>
            <SelectContent>
              {productId && (
                <SelectItem value="clear-option" className="text-destructive">
                  -- Ta bort val --
                </SelectItem>
              )}
              {products &&
                products?.map((item) => (
                  <SelectItem value={item.id} key={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </>
      )}
      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
          {isCreatingVariant ? (
            <>
              <Button
                variant="outline"
                className="mb-4"
                onClick={() => setIsCreatingVariant(false)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till produkt
              </Button>

              <VariantForm
                onSuccess={() => {
                  toast.success("Variant skapad!");
                  reset();
                }}
              />
            </>
          ) : productId ? (
            <VariantForm />
          ) : (
            <ProductForm
              onSuccess={(id) => {
                setProductId(id);
                // Don't navigate away
              }}
              onVariantClick={() => {
                setIsCreatingVariant(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
