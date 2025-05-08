import { ProductForm } from "@/components/admin/products/ProductForm";
import { VariantForm } from "@/components/admin/products/VariantForm";

export default function ProductsPage() {
  return (
    <div className="mx-auto p-6">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-8">Produkter</h1>
      </div>

      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-6">Alla produkter</h2>
          <ProductForm />
          <VariantForm productId="2" />
        </div>
      </div>
    </div>
  );
}
