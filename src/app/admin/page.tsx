// "use client";

// export default function AdminPage() {
//   return (
//     <div className="mx-auto p-6">
//       <div className="flex justify-center">
//         <h1 className="text-3xl font-bold mb-8">Översikt</h1>
//       </div>

//       <div>
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <h2 className="text-xl font-medium mb-6">Min Adminsida</h2>
//         </div>
//       </div>
//     </div>
//   );
// }

import { getProductGroups, getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getColors } from "@/actions/colors";
import { ProductGroupDialog } from "@/components/admin/products/dialogs/ProductGroupDialog";
import { ProductDialog } from "@/components/admin/products/dialogs/ProductDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-2xl font-bold">Produkter</h1>
        <div className="flex flex-wrap w-full sm:w-auto gap-2">
          <ProductGroupDialog
            productGroups={productGroups.success ? productGroups.data : []}
            categories={categories.success ? categories.data : []}
            colors={colorsData}
          >
            <Button className="w-full sm:w-auto text-sm">
              <Plus className="mr-2 h-4 w-4 flex-shrink-0" /> Skapa produktgrupp
              + produkt
            </Button>
          </ProductGroupDialog>

          <ProductDialog
            productGroups={productGroups.success ? productGroups.data : []}
            colors={colorsData}
          >
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              <Plus className="mr-2 h-4 w-4 flex-shrink-0" /> Lägg till produkt
            </Button>
          </ProductDialog>
        </div>
      </div>
      <div className="overflow-auto rounded-md border">
        <ProductDataTableClient data={productsData} colors={colorsData} />
      </div>
    </div>
  );
}
