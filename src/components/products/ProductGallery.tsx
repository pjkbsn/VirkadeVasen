"use client";

import { Category, Color, Product } from "@/types";
import { FilterState, ProductFilter } from "./ProductFilter";
import { ProductCard } from "./ProductCard";
import { useCallback, useState } from "react";
import { getProducts } from "@/actions/products";

type ProductCategoryRelation = {
  product_groups_id: { id: string; name: string }[];

  category_id: { id: string; name: string }[];
};

type ProductGalleryProps = {
  initialProducts: Product[];
  colors: Color[];
  categories: Category[];
  categoryRelations: ProductCategoryRelation[];
};

export function ProductGallery({
  initialProducts,
  colors,
  categories,
  categoryRelations,
}: ProductGalleryProps) {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  console.log("categoryRelations: ", categoryRelations);

  //FIXA FILTER FÖR PRODUCT_GROUPS === "TYP AV DJUR"
  //FIXA FILTER FÖR KATEGORIER T.EX. "VILDA DJUR", "VATTENDJUR", "NYCKELRING" ETC.
  const handleFilterChange = useCallback(async (filters: FilterState) => {
    const { data } = await getProducts({
      categories: filters.categories,
      colors: filters.colors,
      maxPrice: filters.prices.length
        ? Math.min(...filters.prices.map((p) => parseInt(p, 10)))
        : undefined,
    });
    console.log("Data after filter: ", data);
    setFilteredProducts(data || []);
  }, []);

  return (
    <div className="flex gap-6">
      {/*Add md:hidden to hide accordion and show a button to trigger a sidebar with filters*/}
      <aside className="sm:order-2 w-96">
        <div className="sticky top-20 ">
          <ProductFilter
            colors={colors}
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </div>
      </aside>
      {/* Products section */}
      <section className="w-full h-full sm:order-3">
        {filteredProducts.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.product_groups.name || "Unknown"}
                price={product.price || 0}
                imageUrl={
                  product.image_url?.length
                    ? product.image_url[0]
                    : "No image available"
                }
                colorName={product.colors?.name || ""}
              />
            ))}
          </div>
        ) : (
          <div>Inga produkter hittades</div>
        )}
      </section>
    </div>
  );
}
