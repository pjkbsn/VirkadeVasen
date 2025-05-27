"use client";

import { Category, Color, Product } from "@/types";
import { FilterState, ProductFilter } from "./ProductFilter";
import { ProductCard } from "./ProductCard";
import { useCallback, useState } from "react";
import { getProducts } from "@/actions/products";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(initialProducts.length >= 16);
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    categories: [],
    colors: [],
    prices: [],
  });

  console.log("categoryRelations: ", categoryRelations);

  //FIXA FILTER FÖR PRODUCT_GROUPS === "TYP AV DJUR"
  //FIXA FILTER FÖR KATEGORIER T.EX. "VILDA DJUR", "VATTENDJUR", "NYCKELRING" ETC.
  const handleFilterChange = useCallback(async (filters: FilterState) => {
    setIsLoading(true);
    setCurrentPage(1);
    try {
      const { data } = await getProducts({
        categories: filters.categories,
        colors: filters.colors,
        maxPrice: filters.prices.length
          ? Math.min(...filters.prices.map((p) => parseInt(p, 10)))
          : undefined,
        limit: 16,
        offset: 0,
      });
      console.log("Data after filter: ", data);
      setFilteredProducts(data || []);
      setHasMore((data || []).length >= 16);
      setCurrentFilters(filters);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const offset = currentPage * 16;
      const { data } = await getProducts({
        categories: currentFilters.categories,
        colors: currentFilters.colors,
        maxPrice: currentFilters.prices.length
          ? Math.min(...currentFilters.prices.map((p) => parseInt(p, 10)))
          : undefined,
        limit: 16,
        offset,
      });

      if (data && data.length > 0) {
        setFilteredProducts((prev) => [...prev, ...data]);
        setHasMore(data.length >= 16);
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Show More button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Laddar...
                </>
              ) : (
                "Visa fler produkter"
              )}
            </Button>
          </div>
        )}

        {!filteredProducts.length && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">
              Inga produkter matchade din sökning
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
