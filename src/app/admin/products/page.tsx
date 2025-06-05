import { getProductGroups, getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getColors } from "@/actions/colors";
// import { NewProductClient } from "./client";
import { ProductGroupDialog } from "@/components/admin/products/dialogs/ProductGroupDialog";
import { ProductDialog } from "@/components/admin/products/dialogs/ProductDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { ProductTable } from "@/components/admin/products/table/ProductTable";
// import { DataTable } from "@/components/admin/products/table/data-table";
// import { columns } from "@/components/admin/products/table/columns";
import { ProductDataTableClient } from "@/components/admin/products/table/ProductDataTableClient";

export default async function ProductsPage() {
  const [productGroups, products, categories, colors] = await Promise.all([
    getProductGroups(),
    getProducts(),
    getCategories(),
    getColors(),
  ]);

  const productsData = products.success ? products.data : [];
  const colorsData = colors.success ? colors.data : [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produkter</h1>
        <div className="flex gap-2">
          {/* These will be client components that handle the dialogs */}
          <ProductGroupDialog
            productGroups={productGroups.success ? productGroups.data : []}
            categories={categories.success ? categories.data : []}
            colors={colorsData}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Skapa produktgrupp + produkt
            </Button>
          </ProductGroupDialog>

          <ProductDialog
            productGroups={productGroups.success ? productGroups.data : []}
            colors={colorsData}
          >
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Lägg till produkt
            </Button>
          </ProductDialog>
        </div>
      </div>
      <ProductDataTableClient data={productsData} colors={colorsData} />
    </div>
  );
}
