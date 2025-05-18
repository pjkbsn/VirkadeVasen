import { getProductGroups } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getColors } from "@/actions/colors";
// import { NewProductClient } from "./client";
import { ProductGroupDialog } from "@/components/admin/products/ProductGroupDialog";
import { ProductDialog } from "@/components/admin/products/ProductDialog";
import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/data-table";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
  const [productGroups, categories, colors] = await Promise.all([
    getProductGroups(),
    getCategories(),
    getColors(),
  ]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produkter</h1>
        <div className="flex gap-2">
          {/* These will be client components that handle the dialogs */}
          <ProductGroupDialog
            productGroups={productGroups.success ? productGroups.data : []}
            categories={categories.success ? categories.data : []}
            colors={colors.success ? colors.data : []}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Skapa produktgrupp + produkt
            </Button>
          </ProductGroupDialog>

          <ProductDialog
            productGroups={productGroups.success ? productGroups.data : []}
            colors={colors.success ? colors.data : []}
          >
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Lägg till produkt
            </Button>
          </ProductDialog>
        </div>
      </div>

      {/* <DataTable
        columns={ProductsColumns}
        data={products.success ? products.data : []}
      /> */}
    </div>
  );
}
