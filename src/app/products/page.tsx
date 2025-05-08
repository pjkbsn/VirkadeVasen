import { createClient } from "@/utils/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";
import { cookies } from "next/headers";

interface ProductVariant {
  id: string;
  price: number;
  stock: number;
  image_url: string | null;
  color_id: string;
  product: {
    // This is an array, not a single object
    id: string;
    name: string;
    description: string;
  }[];
  color?: {
    // This is also an array
    name: string;
  }[];
}

export default async function ProductPage() {
  const supabase = createClient(cookies());

  const { data, error } = await supabase.from("product_variants").select(`
    id, 
    price, 
    stock, 
    image_url, 
    color_id,
    products:product_id(id, name, description), 
    colors:color_id(name)
  `);

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Failed to load products.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {(data as any[])?.map((variant) => {
        console.log("Rendering variant:", variant.id);
        console.log("Product data for this variant:", variant.products);
        console.log("Color data for this variant:", variant.colors);

        return (
          <ProductCard
            key={variant.id}
            id={variant.id}
            name={variant.products?.name || "Unknown"} // Access as object
            price={variant.price || 0}
            imageUrl={variant.image_url || "/placeholder.png"}
            colorName={variant.colors?.name || ""} // Access as object
          />
        );
      })}
    </div>
  );
}
