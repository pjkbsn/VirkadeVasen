import { getAllProductsByGroupId, getSingleProduct } from "@/actions/products";
import { ProductDetails } from "@/components/products/ProductDetails";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const { data: product } = await getSingleProduct(id);

  const { data: allProducts = [] } = product?.product_groups?.id
    ? await getAllProductsByGroupId(product.product_groups.id)
    : { data: [] };

  const filteredProducts = allProducts.filter((p) => p.id !== product?.id);

  return (
    <div className="container mx-auto max-w-6xl py-12">
      {" "}
      <ProductDetails product={product} relatedProducts={filteredProducts} />
    </div>
  );
}
