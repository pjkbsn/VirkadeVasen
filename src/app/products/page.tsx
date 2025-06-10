import { getProducts } from "@/actions/products";
import { getColors } from "@/actions/colors";
import { getCategories, getCategoryRelation } from "@/actions/categories";
import { ProductGallery } from "@/components/products/ProductGallery";

export default async function ProductPage() {
  const { data: products } = await getProducts();
  const { data: colors } = await getColors();
  const { data: categories } = await getCategories();
  const { data } = await getCategoryRelation();

  // const prices = products?.map((p) => p.price).filter(Boolean);
  // console.log("Prices:", prices);

  return (
    <main className="container mx-auto px-6 py-6 sm:py-8 w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
          Våra produkter
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
          Utforska vårt sortiment av handgjorda produkter skapade med omsorg och
          kärlek.
        </p>
      </div>
      <ProductGallery
        initialProducts={products}
        colors={colors}
        categories={categories}
        categoryRelations={data}
      />
    </main>
  );
}
