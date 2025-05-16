"use client";

// import { createClient } from "@/utils/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";
// import { cookies } from "next/headers";
import { ProductFilter } from "@/components/products/ProductFilter";
import { useState, useEffect } from "react";
import { ProductVariant } from "@/types";
import { useProducts } from "@/hooks/useProducts";

export default function ProductPage() {
  const [products, setProducts] = useState<ProductVariant[] | null>(null);
  const { getProductVariants, loading, error } = useProducts();

  console.log("Products: ", products);
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProductVariants();
      console.log("Data: ", data);
      if (data) {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p>Error: {typeof error === "string" ? error : error.message}</p>;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Våra produkter</h1>
        <p className="text-gray-600">
          Utforska vårt sortiment av handgjorda produkter skapade med omsorg och
          kärlek.
        </p>
      </div>

      {/* Filter/category sidebar and product content area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-6">
          <ProductFilter />
        </aside>

        {/* Main content area where products will be displayed */}
        <main className="md:col-span-3">
          {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products &&
              products?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.products?.name || "Unknown"} // Access as object
                  price={product.price || 0}
                  imageUrl={
                    product.image_url?.length
                      ? product.image_url[0]
                      : "No image available"
                  }
                  colorName={product.colors?.name || ""} // Access as object
                />
              ))}
          </div>
        </main>
      </div>
    </>
  );
}
